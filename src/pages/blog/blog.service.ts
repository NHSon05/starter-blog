// Cấu hình RTK Query
// blog.slice.ts là nơi quản lý trạng thái nội bộ của giao diện
// Đây là cầu nối liên lạc giữa App React và Backend

// import { build } from "@reduxjs/toolkit/dist/query/core/buildMiddleware/cacheLifecycle"
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
// import { type RootState } from 'store'
import { Post } from 'types/blog.type'
import { CustomError } from 'utils/helper'

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
  tagTypes: ['Posts'], // Những kiểu tag cho phép dùng trong blogApi
  keepUnusedDataFor: 10,
  baseQuery: fetchBaseQuery({
    baseUrl: 'http://localhost:4000/',
    prepareHeaders: (headers) => {
      // const token = (getState() as RootState).auth.token
      // if (token) {
      headers.set('authorization', `Bearer Son`)
      // }
      return headers
    }
  }), //function dựa trên fetchApi
  endpoints: (build) => ({
    // Generic type theo thứ tự là response trả về và argument
    // query: Lấy về và Cache, gắn Tag 'Posts'
    getPosts: build.query<Post[], void>({
      query: () => 'posts', // method không có argument,
      providesTags(result) {
        /**
         * Call back này chạy mỗi khi getPosts chạy
         * Mong muốn là return về một mảng kiểu
         * ```ts
         * interface Tags: {
         *    type: "Posts";
         *    id: string;
         * }[]
         * ```
         * Vì thế phải thêm as const vào để báo hiệu type là Read only, không thể mutate
         */
        if (result) {
          const final = [
            ...result.map(({ id }) => ({ type: 'Posts' as const, id })),
            { type: 'Posts' as const, id: 'LIST' }
          ]
          return final
        }
        const final = [{ type: 'Posts' as const, id: 'LIST' }]
        return final
      }
    }),
    addPost: build.mutation<Post, Omit<Post, 'id'>>({
      query(body) {
        try {
          return {
            url: 'posts',
            method: 'POST',
            body
          }
        } catch (error: any) {
          throw new CustomError(error.message)
        }
      },
      /**
       * invalidateTags: Nó cung cấp các tag để báo hiệu cho những method nào có provideTags
       * match với nó sẽ bị gọi lại
       * Trong trường hợp này thì getPosts sẽ chạy lại
       */
      invalidatesTags: (result, error, body) => [{ type: 'Posts', id: 'LIST' }]
    }),
    getPost: build.query<Post, string>({
      query: (id) => ({
        url: `posts/${id}`,
        headers: {
          hello: 'Son'
        },
        params: {
          first_name: 'son',
          last_name: 'nguyen'
        }
      })
    }),
    updatePost: build.mutation<Post, { id: string; body: Post }>({
      query(data) {
        return {
          url: `posts/${data.id}`,
          method: 'PUT',
          body: data.body
        }
      },
      // Trong trường hợp này thì getPosts sẽ chạy lại
      invalidatesTags: (result, error, data) => [{ type: 'Posts', id: data.id }]
    }),
    deletePost: build.mutation<{}, string>({
      query(id) {
        return {
          url: `posts/${id}`,
          method: 'DELETE'
        }
      },
      // Trong trường hợp này, nó làm cho getpost chạy lại
      invalidatesTags: (result, error, id) => [{ type: 'Posts', id: id }]
    })
  })
})

export const { useGetPostsQuery, useAddPostMutation, useGetPostQuery, useUpdatePostMutation, useDeletePostMutation } =
  blogApi
