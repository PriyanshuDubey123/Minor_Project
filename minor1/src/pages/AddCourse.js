import React, { useState } from 'react';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { useFormik } from 'formik';
import axios from 'axios';
import { motion } from 'framer-motion';
import {
  Stepper,
  Step,
  StepLabel,
  Button,
  TextField,
  Select,
  MenuItem,
  FormControl,
  Box,
  InputLabel,
  Typography
} from '@mui/material';
import Modal from '../utils/Modal';
import { useSelector } from 'react-redux';
import { selectUserInfo } from '../features/user/userSlice';

const steps = ['Course Details', 'Description & Price', 'Media Upload'];

const AddCourse = () => {


  const user = useSelector(selectUserInfo);


  const [step, setStep] = useState(0);
  const [thumbnailPreview, setThumbnailPreview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [courseId, setCourseId] = useState(null);

  const initialValues = {
    name: '',
    duration: '',
    description: '',
    priceOption: '',
    price: '',
    special: '',
    category: '',
    language: '',
    thumbnail: null
  };

  const validate = values => {
    const errors = {};

    if (step === 0) {
      if (!values.name) {
        errors.name = 'Course name is required';
      }
      if (!values.duration) {
        errors.duration = 'Duration is required';
      } else if (values.duration <= 0) {
        errors.duration = 'Duration must be a positive number';
      }
    }

    if (step === 1) {
      if (!values.description) {
        errors.description = 'Description is required';
      }
      if (!values.priceOption) {
        errors.priceOption = 'Price option is required';
      } else if (values.priceOption === 'paid' && (!values.price || values.price <= 0 || values.price > 10000)) {
        errors.price = 'Price must be between 1 and 10000';
      }
      if (!values.special) {
        errors.special = 'This field is required';
      }
      if (!values.category) {
        errors.category = 'Category is required';
      }
      if (!values.language) {
        errors.language = 'Language is required';
      }
    }

    if (step === 2) {
      if (!values.thumbnail) {
        errors.thumbnail = 'Thumbnail is required';
      }
    }

    return errors;
  };

  const formik = useFormik({
    initialValues,
    validate,
    onSubmit: async (values) => {
      setIsSubmitting(true);
      const formData = new FormData();
      formData.append('name', values.name);
      formData.append('duration', values.duration);
      formData.append('description', values.description);
      formData.append('price', values.priceOption === 'free' ? 0 : values.price);
      formData.append('special', values.special);
      formData.append('category', values.category);
      formData.append('language', values.language);
      formData.append('thumbnail', values.thumbnail);

      try {
        const response = await axios.post(`https://minor-backend-50m4.onrender.com/api/courses/upload/${user?.id}`, formData);
        console.log(response);
        setIsSubmitting(false);
        setShowModal(true);
        setCourseId(response.data.course._id);
      } catch (error) {
        console.error(error);
        setIsSubmitting(false);
      }
    }
  });

  const nextStep = () => setStep(step + 1);
  const prevStep = () => setStep(step - 1);

  const handleThumbnailChange = (event) => {
    const file = event.currentTarget.files[0];
    if (file && file.type.startsWith('image/')) {
      formik.setFieldValue('thumbnail', file);
      setThumbnailPreview(URL.createObjectURL(file));
    } else {
      alert('Please select a valid image file');
    }
  };

  return (
    <>
      {showModal && <Modal
        showModal={showModal}
        setShowModal={setShowModal}
        campId={courseId}
        url={`http://localhost:3000/course/${courseId}`}
      />}
      <div className="container mx-auto mt-10">
        <Box sx={{ maxWidth: 800, mx: 'auto', p: 3, bgcolor: 'background.paper', boxShadow: 3, borderRadius: 2 }}>
          <Stepper activeStep={step} alternativeLabel>
            {steps.map((label, index) => (
              <Step key={index}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
          <form onSubmit={formik.handleSubmit}>
            {step === 0 && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
                <Box sx={{ mb: 3 }}>
                  <FormControl fullWidth margin="normal">
                    <TextField
                      label="Course Name *"
                      name="name"
                      value={formik.values.name}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      error={formik.touched.name && Boolean(formik.errors.name)}
                      helperText={formik.touched.name && formik.errors.name}
                      fullWidth
                      margin="normal"
                      variant="outlined"
                    />
                  </FormControl>
                  <FormControl fullWidth margin="normal">
                    <TextField
                      label="Course Duration (hours) *"
                      name="duration"
                      type="number"
                      value={formik.values.duration}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      error={formik.touched.duration && Boolean(formik.errors.duration)}
                      helperText={formik.touched.duration && formik.errors.duration}
                      fullWidth
                      margin="normal"
                      variant="outlined"
                    />
                  </FormControl>
                </Box>
              </motion.div>
            )}

            {step === 1 && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
                <Box sx={{ mb: 3 }}>
                  <FormControl fullWidth margin="normal">
                    <TextField
                      label="Course Description *"
                      name="description"
                      value={formik.values.description}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      error={formik.touched.description && Boolean(formik.errors.description)}
                      helperText={formik.touched.description && formik.errors.description}
                      fullWidth
                      margin="normal"
                      variant="outlined"
                    />
                  </FormControl>
                  <FormControl fullWidth margin="normal">
                    <InputLabel id="priceOption-label">Price Option *</InputLabel>
                    <Select
                      labelId="priceOption-label"
                      name="priceOption"
                      value={formik.values.priceOption}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      error={formik.touched.priceOption && Boolean(formik.errors.priceOption)}
                      fullWidth
                      margin="normal"
                    >
                      <MenuItem value="">Select Price Option *</MenuItem>
                      <MenuItem value="free">Free</MenuItem>
                      <MenuItem value="paid">Paid</MenuItem>
                    </Select>
                    {formik.touched.priceOption && formik.errors.priceOption && (
                      <Typography color="error" variant="body2">{formik.errors.priceOption}</Typography>
                    )}
                  </FormControl>
                  {formik.values.priceOption === 'paid' && (
                    <FormControl fullWidth margin="normal">
                      <TextField
                        label="Price *"
                        name="price"
                        type="number"
                        value={formik.values.price}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={formik.touched.price && Boolean(formik.errors.price)}
                        helperText={formik.touched.price && formik.errors.price}
                        fullWidth
                        margin="normal"
                        variant="outlined"
                      />
                    </FormControl>
                  )}
                  <FormControl fullWidth margin="normal">
                    <TextField
                      label="What's Special? *"
                      name="special"
                      value={formik.values.special}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      error={formik.touched.special && Boolean(formik.errors.special)}
                      helperText={formik.touched.special && formik.errors.special}
                      fullWidth
                      margin="normal"
                      variant="outlined"
                    />
                  </FormControl>
                  <FormControl fullWidth margin="normal">
                    <InputLabel id="category-label">Category *</InputLabel>
                    <Select
                      labelId="category-label"
                      name="category"
                      value={formik.values.category}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      error={formik.touched.category && Boolean(formik.errors.category)}
                      fullWidth
                      margin="normal"
                    >
                      <MenuItem value="IIT JEE">IIT JEE</MenuItem>
                      <MenuItem value="UPSC">UPSC</MenuItem>
                      <MenuItem value="Bank exams">Bank exams</MenuItem>
                      <MenuItem value="CBSE class 12">CBSE class 12</MenuItem>
                      <MenuItem value="SSC exams">SSC exams</MenuItem>
                      <MenuItem value="NEET UG">NEET UG</MenuItem>
                      <MenuItem value="Programming">Programming</MenuItem>
                    </Select>
                    {formik.touched.category && formik.errors.category && (
                      <Typography color="error" variant="body2">{formik.errors.category}</Typography>
                    )}
                  </FormControl>
                  <FormControl fullWidth margin="normal">
                    <InputLabel id="language-label">Language *</InputLabel>
                    <Select
                      labelId="language-label"
                      name="language"
                      value={formik.values.language}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      error={formik.touched.language && Boolean(formik.errors.language)}
                      fullWidth
                      margin="normal"
                    >
                      <MenuItem value="Hindi">Hindi</MenuItem>
                      <MenuItem value="Sanskrit">Sanskrit</MenuItem>
                      <MenuItem value="English">English</MenuItem>
                      <MenuItem value="Tamil">Tamil</MenuItem>
                      <MenuItem value="Telugu">Telugu</MenuItem>
                      <MenuItem value="Kannada">Kannada</MenuItem>
                    </Select>
                    {formik.touched.language && formik.errors.language && (
                      <Typography color="error" variant="body2">{formik.errors.language}</Typography>
                    )}
                  </FormControl>
                </Box>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
                <Box sx={{ mb: 3 }}>
                  <FormControl fullWidth margin="normal">
                    <InputLabel id="thumbnail-label"></InputLabel>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleThumbnailChange}
                      style={{ display: 'none' }}
                      id="thumbnail-input"
                    />
                    <label htmlFor="thumbnail-input">
                      <Button variant="contained" component="span" color="primary">
                        Upload Thumbnail
                      </Button>
                    </label>
                    {formik.touched.thumbnail && formik.errors.thumbnail && (
                      <Typography color="error" variant="body2">{formik.errors.thumbnail}</Typography>
                    )}
                    {thumbnailPreview && (
                      <div
                        style={{
                          marginTop: '10px',
                          maxHeight: '200px',
                          border: '2px dashed #ccc',
                          display: 'flex',
                          justifyContent: 'center',
                          alignItems: 'center',
                          overflow: 'hidden'
                        }}
                      >
                        <img
                          src={thumbnailPreview}
                          alt="Thumbnail Preview"
                          style={{ objectFit: 'contain' }}
                          className='h-[200px]'
                        />
                      </div>
                    )}
                  </FormControl>
                </Box>
              </motion.div>
            )}

            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
              <Button
                variant="contained"
                color="primary"
                onClick={prevStep}
                disabled={step === 0}
                startIcon={<ArrowBackIcon />}
              >
                Back
              </Button>
              <Button
                variant="contained"
                color="primary"
                onClick={() => {
                  if (Object.keys(validate(formik.values)).length === 0) {
                    if (step === steps.length - 1) {
                      formik.handleSubmit();
                    } else {
                      nextStep();
                    }
                  } else {
                    formik.setTouched({
                      name: true,
                      duration: true,
                      description: true,
                      priceOption: true,
                      price: true,
                      special: true,
                      category: true,
                      language: true,
                      thumbnail: true
                    });
                  }
                }}
                endIcon={<ArrowForwardIcon />}
              >
                {step === steps.length - 1 ? 'Submit' : 'Next'}
              </Button>
            </Box>
          </form>
          {isSubmitting && (
            <div className="text-center mt-4">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, loop: Infinity, repeatDelay: 1 }}
              >
                <Typography variant="h6">Creating your course... Please wait a moment.</Typography>
              </motion.div>
            </div>
          )}
        </Box>
      </div>
    </>
  );
};

export default AddCourse;
