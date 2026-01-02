// Cấu hình RTK Query
// blog.slice.ts là nơi quản lý trạng thái nội bộ của giao diện
// Đây là cầu nối liên lạc giữa App React và Backend

// import { build } from "@reduxjs/toolkit/dist/query/core/buildMiddleware/cacheLifecycle"
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { Post } from 'types/blog.type'

// khai báo toàn bộ logic gọi. Thay vì dùng axios hay fetch thì gom vào file này
// Reducer path: Tên định danh trong store (blogApi)
// Base URL: Địa chỉ gốc của server
// Tag Types: Định nghĩa các nhãn để quản lý cache

/*
                ĐỊNH NGHĨA CÁC ENDPOINTS
  - Endpoint là tập hợp những method giúp get, put, post, delete... tương tác với server
  Đây là nơi bạn cần làm gì với Server
    - Lấy danh sách bài viết (query)
    - Thêm bài viết mới (mutation)
    - Sửa/Xoá bài viết (mutation)

                XUẤT XƯỞNG CÁC HOOKS
  Từ các endpoint định nghĩa. RTK Query sẽ tự động sinh ra các React Hooks
    - Định nghĩa endpoint getPosts
    - Nó tự tạo ra useGetPostQuery
    - Mang hook này vào component xài, không cần viết thêm logic useEffect hay useState
*/

export const blogApi = createApi({
  reducerPath: 'blogApi', // Tên field trong redux state
  baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:4000/' }), //function dựa trên fetchApi
  endpoints: (build) => ({
    // Generic type theo thứ tự là response trả về và argument
    // query: Lấy về và Cache, gắn Tag 'Posts'
    getPosts: build.query<Post[], void>({
      query: () => 'posts' // method không có argument,
      // providesTags: ['Posts']
    })
  })
})

export const { useGetPostsQuery } = blogApi
