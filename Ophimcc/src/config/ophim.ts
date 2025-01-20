import axiosInstance from "./axios";

interface GetAllParams {
  page: number;
}

export const getAll = async (params:GetAllParams ) => {
  try {
    const response = await axiosInstance.get('/danh-sach/phim-moi-cap-nhat', {
      params,
    });
    return response.data;
  } catch (error) {
    return Promise.reject(error);
  }
};

export const getDetail = async (slug: string) => {
  try {
    const response = await axiosInstance.get(`/phim/${slug}`);
    return response.data;
  } catch (error) {
    return Promise.reject(error);
  }
};
