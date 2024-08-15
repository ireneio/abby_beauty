import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  sidebarOpen: '',
  alert: {
    open: false,
    title: '',
    content: '',
    showConfirmButton: false,
  }
};

export const globalSlice = createSlice({
  name: 'global',
  initialState,
  reducers: {
    setSidebarOpen: (state, action) => {
      state.sidebarOpen = action.payload;
      function disableOnScroll(event: Event) {
        event.preventDefault();
      }
      if (action.payload === true) {
        document.body.style.overflowY = 'hidden'
        document.body.addEventListener('scroll', disableOnScroll, { passive: false });
      } else if (action.payload === false) {
        document.body.style.overflowY = 'auto'
        document.body.removeEventListener('scroll', disableOnScroll)
      }
    },
    openAlert(state, action) {
      if (action.payload.title) {
        state.alert.title = action.payload.title
      } else {
        state.alert.title = '錯誤'
      }

      if (action.payload.content) {
        state.alert.content = action.payload.content
      } else {
        state.alert.content = ''
      }

      if (action.payload.showConfirmButton !== undefined) {
        state.alert.showConfirmButton = action.payload.showConfirmButton
      } else {
        state.alert.showConfirmButton = true
      }

      state.alert.open = true
    },
    closeAlert(state) {
      if (state.alert.open) {
        state.alert.open = false
      }
      // const tid = setTimeout(() => {
      //   state.alert.title = ''
      //   state.alert.content = ''
      //   clearTimeout(tid)
      // }, 1000)
    }
  },
});

export const { setSidebarOpen, openAlert, closeAlert } = globalSlice.actions;

export default globalSlice.reducer;