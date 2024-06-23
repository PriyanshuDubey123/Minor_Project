import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { updateCourse, createCourse, fetchAllCourses, fetchCoursesByFilters, fetchLanguages , fetchCategories, fetchCourseById } from './CourseAPI';

const initialState = {
  courses: [],
  languages: [],
  categories: [],
  totalItems:0,
  status: 'idle',
  selectedCourse: null,
};

export const fetchAllCoursesAsync = createAsyncThunk(
  'course/fetchAllCourses',
  async () => {
    const response = await fetchAllCourses();
    return response.data;
  }
);

export const fetchCoursesByFiltersAsync = createAsyncThunk(
  'course/fetchCoursesByFilters',
  async ({filter,sort,pagination,admin}) => {
    const response = await fetchCoursesByFilters(filter,sort,pagination,admin);
    return response.data;
  }
);
export const fetchLanguagesAsync = createAsyncThunk(
  'course/fetchLanguages',
  async () => {
    const response = await fetchLanguages();
    return response.data;
  }
);
export const fetchCategoriesAsync = createAsyncThunk(
  'course/fetchCategories',
  async () => {
    const response = await fetchCategories();
    return response.data;
  }
);

export const fetchCourseByIdAsync = createAsyncThunk(
  'course/fetchCourseById',
  async (id) => {
    const response = await fetchCourseById(id);
    return response.data;
  }
);

export const createCourseAsync = createAsyncThunk(
  'course/createCourse',
  async (Course) => {
    const response = await createCourse(Course);
    return response.data;
  }
);

export const updateCourseAsync = createAsyncThunk(
  'course/updateCourse',
  async (Course) => {
    const response = await updateCourse(Course);
    return response.data;
  }
);

export const CourseSlice = createSlice({
  name: 'course',
  initialState,

  reducers: {
clearSelectedCourse:(state)=>{
state.selectedCourse = null;
}
  },

  extraReducers: (builder) => {
    builder
      .addCase(fetchAllCoursesAsync.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchAllCoursesAsync.fulfilled, (state, action) => {
        state.status = 'idle';
        state.courses = action.payload;
      })
      .addCase(fetchCoursesByFiltersAsync.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchCoursesByFiltersAsync.fulfilled, (state, action) => {
        state.status = 'idle';
        state.courses = action.payload.courses;
        state.totalItems = action.payload.totalItems;
      })
      .addCase(fetchLanguagesAsync.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchLanguagesAsync.fulfilled, (state, action) => {
        state.status = 'idle';
        state.languages = action.payload;
      }) 
      .addCase(fetchCategoriesAsync.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchCategoriesAsync.fulfilled, (state, action) => {
        state.status = 'idle';
        state.categories = action.payload;
      })
      .addCase(fetchCourseByIdAsync.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchCourseByIdAsync.fulfilled, (state, action) => {
        state.status = 'idle';
        state.selectedCourse = action.payload;
      })
      .addCase(createCourseAsync.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(createCourseAsync.fulfilled, (state, action) => {
        state.status = 'idle';
        state.courses.push(action.payload);
      })
      .addCase(updateCourseAsync.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(updateCourseAsync.fulfilled, (state, action) => {
        state.status = 'idle';
        const index = state.courses.findIndex(course=>course.id===action.payload.id);
        state.courses[index] = action.payload
      })
  },
});

export const { clearSelectedCourse } = CourseSlice.actions;

export const selectAllCourses = (state) => state.course.courses;
export const selectTotalItems = (state) => state.course.totalItems;

export const selectLanguages = (state) => state.course.languages;
export const selectCategories = (state) => state.course.categories;

export const selectCourseById = (state) => state.course.selectedCourse;

export default CourseSlice.reducer;
