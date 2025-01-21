import axiosInstance from "./axios";

interface GetAllParams {
  page: number;
}

export const getAll = async (params:GetAllParams ) => {
  try {
    const response = await axiosInstance.get('/', {
      params,
    });
    return response.data;
  } catch (error) {
    return Promise.reject(error);
  }
};

export const getDetail = async (slug: string) => {
  console.log(slug);

  try {
    const response = await axiosInstance.get(`/detail/${slug}`);
    return response.data;
  } catch (error) {
    return Promise.reject(error);
  }
};

export const filterMovies = async (options: any) => {
  try {
    const response = await axiosInstance.get('/filter', {
      params: options,
    });
    return response.data;
  } catch (error) {
    return Promise.reject(error);
  }
};
