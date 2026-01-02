// Tạo ra một redux slice bằng thư viện redux toolkit

import { createSlice } from '@reduxjs/toolkit'

interface BlogState {
  postId: string
}

const initialState: BlogState = {
  postId: ''
}

const blogSlice = createSlice({
  name: 'blog', // đặt tên cho slice. Sau này sẽ làm tiền tố cho các action (blog/action)
  initialState, // nơi chứa các giá trị mặc định
  reducers: {} // nơi chứa các hàm thay đổi state
})

const blogReducer = blogSlice.reducer

export default blogReducer
