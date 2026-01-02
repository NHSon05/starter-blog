import { configureStore } from '@reduxjs/toolkit'
import { setupListeners } from '@reduxjs/toolkit/dist/query'
import { blogApi } from 'pages/blog/blog.service'
import blogReducer from 'pages/blog/blog.slice'
// ...

export const store = configureStore({
  reducer: {
    blog: blogReducer,
    [blogApi.reducerPath]: blogApi.reducer //thêm reducer được tạo từ api slice
  },
  // Thêm api middleware để enable các tính năng như caching, invalidation, polling của rtk-query
  // Middleware là nơi xử lý 1 action ghi đã được gửi đến store
  // Action -> Middleware -> Reducer -> Store (State thay đổi)
  /*
            NHIỆM VỤ CỦA MIDDLEWARE
    -   Chặn (Intercept):   Kiểm tra xem action đó cơ hợp lệ không
    -   xử lý bất đồng bộ (Async):  Gọi API, chờ data trả về
    -   Ghi log:  Ghi lại lịch sử thay đổi để debug
    -   Side Effects: Thực hiện các lệnh bên như lưu vào Storage,...
  */
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(blogApi.middleware)
})

// optional, nhưng bắt buộc nếu dùng tính năng refetchOnFocus/refetchOnReconnect
setupListeners(store.dispatch)

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch