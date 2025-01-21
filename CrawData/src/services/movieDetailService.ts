import { MovieModel } from '../models/Movie';
import { MovieDetailModel } from '../models/MovieDetail';
import axios from 'axios';
import { delay, retry } from '../utils/common';

const baseURL = process.env.API_URL || 'https://ophim1.com';
let isProcessing = false;

export const processMovieDetails = async (): Promise<void> => {
  if (isProcessing) {
    console.log('Đang trong quá trình xử lý chi tiết phim...');
    return;
  }

  try {
    isProcessing = true;

    const movies = await MovieModel.find({
      slug: {
        $nin: await MovieDetailModel.distinct('movie.slug')
      }
    }).select('_id slug').lean();


    console.log(`🔍 Tìm thấy ${movies.length} phim cần cập nhật chi tiết`);

    let successCount = 0;
    let errorCount = 0;

    for (const movie of movies) {
      try {
        const slugValue = Array.isArray(movie.slug) ? movie.slug[0] : movie.slug;
        if (!slugValue) {
          console.error(`⚠️ Bỏ qua phim với ID ${movie._id}: Slug không hợp lệ`);
          errorCount++;
          continue;
        }

        const existingDetail = await MovieDetailModel.findOne({
          'movie.slug': slugValue
        });

        if (existingDetail) {
          console.log(`⏩ Bỏ qua phim ${slugValue}: Đã tồn tại trong DB`);
          continue;
        }

        // Sử dụng hàm retry để xử lý việc gọi API
        const response = await retry(
          async () => {
            const requestUrl = `${baseURL}/phim/${slugValue}`;
            console.log(`🌐 Đang gọi API với URL: ${requestUrl}`);

            const res = await axios.get(requestUrl, {
              timeout: 5000
            });
            if (!res?.data?.movie || !res?.data?.episodes) {
              throw new Error('Dữ liệu API không hợp lệ');
            }

            // Xử lý slug cho server_data
            res.data.episodes.forEach((episode: any) => {
              episode.server_data = episode.server_data.map((data: any) => ({
                ...data,
                slug: data.name.toLowerCase().replace(/\s+/g, '-') // Tạo slug từ name
              }));
            });

            return res;
          },
          3,
          1000
        );



        const movieData = {
          ...response.data.movie,
          slug: slugValue // Đảm bảo lưu giá trị slug đã được xử lý
        };

        // Lưu vào database
        await MovieDetailModel.create({
          movie: movieData,
          episodes: response.data.episodes
        });

        successCount++;
        console.log(`✅ Đã lưu chi tiết phim: ${slugValue}`);

        await delay(1000);
      } catch (error) {
        errorCount++;
        console.error(`❌ Lỗi khi xử lý phim ${movie._id}:`, error);
        continue;
      }
    }

    console.log(`
🎯 Kết quả xử lý:
- Tổng số phim: ${movies.length}
- Thành công: ${successCount}
- Thất bại: ${errorCount}
    `);

  } catch (error) {
    console.error('❌ Lỗi khi xử lý chi tiết phim:', error);
    throw error;
  } finally {
    isProcessing = false;
  }
};
