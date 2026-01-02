// Tạo ra một redux slice bằng thư viện redux toolkit

import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface BlogState {
  postId: string
}

const initialState: BlogState = {
  postId: ''
}

const blogSlice = createSlice({
  name: 'blog', // đặt tên cho slice. Sau này sẽ làm tiền tố cho các action (blog/action)
  initialState, // nơi chứa các giá trị mặc định
  reducers: {
    startEditPost: (state, action: PayloadAction<string>) => {
      state.postId = action.payload
    },
    cancelEditPost: (state) => {
      state.postId = ''
    }
  } // nơi chứa các hàm thay đổi stated
})
export const { startEditPost, cancelEditPost } = blogSlice.actions
const blogReducer = blogSlice.reducer
export default blogReducer
