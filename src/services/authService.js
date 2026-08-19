import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://payperview-platform.onrender.com/api/v1';

// Create a dedicated Axios instance
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000,
});

/**
 * Request a password reset link to be sent to the user's email.
 * @param {string} email 
 * @returns {Promise<{success: boolean, message: string, data?: any}>}
 */
export async function requestForgotPassword(email) {
  try {
    const response = await apiClient.post('/auth/forgot-password', { email });

    return {
      success: true,
      message: response.data?.message || 'تم إرسال رابط إعادة تعيين كلمة المرور إلى بريدك الإلكتروني بنجاح.',
      data: response.data,
    };
  } catch (error) {
    const errorMsg =
      error.response?.data?.message ||
      error.response?.data?.error ||
      (error.code === 'ECONNABORTED' ? 'انتهت مهلة الاتصال بالخادم. يرجى المحاولة مرة أخرى.' : null) ||
      'حدث خطأ أثناء إرسال الرابط. يرجى المحاولة مرة أخرى.';

    return {
      success: false,
      message: errorMsg,
    };
  }
}

/**
 * Reset password using the reset token received via email.
 * @param {string} token 
 * @param {string} password 
 * @returns {Promise<{success: boolean, message: string, data?: any}>}
 */
export async function resetPassword(token, password) {
  try {
    const response = await apiClient.post(`/auth/reset-password/${token}`, { password });

    return {
      success: true,
      message: response.data?.message || 'تم تحديث كلمة المرور بنجاح!',
      data: response.data,
    };
  } catch (error) {
    const errorMsg =
      error.response?.data?.message ||
      error.response?.data?.error ||
      (error.code === 'ECONNABORTED' ? 'انتهت مهلة الاتصال بالخادم. يرجى المحاولة لاحقاً.' : null) ||
      'فشل في إعادة تعيين كلمة المرور. قد يكون الرابط منتهي الصلاحية أو غير صالح.';

    return {
      success: false,
      message: errorMsg,
    };
  }
}

export default apiClient;
