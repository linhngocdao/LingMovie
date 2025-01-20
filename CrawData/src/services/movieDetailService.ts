import axios from 'axios';
import { MovieModel } from '../models/Movie';
import { MovieDetailModel } from '../models/MovieDetail';

const baseURL = 'https://ophim1.com';
let isProcessing = false;

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const processMovieDetails = async (): Promise<void> => {
  if (isProcessing) {
    console.log('Đang trong quá trình xử lý chi tiết phim...');
    return;
  }

  try {
    isProcessing = true;

    // Lấy danh sách phim chưa có chi tiết
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
        // Kiểm tra lại xem phim đã được xử lý chưa
        const existingDetail = await MovieDetailModel.findOne({ 'movie.slug': movie.slug });
        if (existingDetail) {
          console.log(`⏩ Bỏ qua phim ${movie.slug}: Đã tồn tại trong DB`);
          continue;
        }

        // Gọi API với retry mechanism
        const maxRetries = 3;
        let retryCount = 0;
        let response;

        while (retryCount < maxRetries) {
          try {
            response = await axios.get(`${baseURL}/phim/${movie.slug}`, {
              timeout: 5000
            });
            break;
          } catch (error) {
            retryCount++;
            if (retryCount === maxRetries) throw error;
            await delay(1000 * retryCount);
            console.log(`🔄 Thử lại lần ${retryCount} cho phim: ${movie.slug}`);
          }
        }

        if (!response?.data?.movie || !response?.data?.episodes) {
          console.log(`⚠️ Bỏ qua phim ${movie.slug}: Dữ liệu không hợp lệ`);
          errorCount++;
          continue;
        }

        // Lưu vào database
        await MovieDetailModel.create({
          movie_id: movie._id,
          movie: response.data.movie,
          episodes: response.data.episodes
        });

        successCount++;
        console.log(`✅ Đã lưu chi tiết phim: ${movie.slug}`);

        // Delay để tránh quá tải API
        await delay(1000);
      } catch (error) {
        errorCount++;
        console.error(`❌ Lỗi khi xử lý phim ${movie.slug}:`, error);
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
