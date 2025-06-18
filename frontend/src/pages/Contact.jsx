import React, { useState } from 'react';
import { FaMapMarkerAlt, FaPhone, FaEnvelope, FaPaperPlane } from 'react-icons/fa'; // Import icons

const Contact = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    });

    const [formStatus, setFormStatus] = useState({
        submitted: false,
        success: false,
        message: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevData => ({
            ...prevData,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setFormStatus({ submitted: true, success: false, message: 'Đang gửi...' });

        // Simulate API call or form submission
        try {
            // Replace with your actual API endpoint for sending contact form data
            // const response = await fetch('/api/contact', {
            //     method: 'POST',
            //     headers: {
            //         'Content-Type': 'application/json',
            //     },
            //     body: JSON.stringify(formData),
            // });
            // const data = await response.json();

            // Mock success response
            await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate network delay
            const mockSuccess = true; // Change to false to test error state

            if (mockSuccess) { // if (response.ok && data.success) {
                setFormStatus({ submitted: true, success: true, message: 'Tin nhắn của bạn đã được gửi thành công! Chúng tôi sẽ phản hồi sớm nhất có thể.' });
                setFormData({ name: '', email: '', subject: '', message: '' }); // Clear form
            } else {
                setFormStatus({ submitted: true, success: false, message: 'Đã xảy ra lỗi khi gửi tin nhắn. Vui lòng thử lại sau.' }); // data.message ||
            }
        } catch (error) {
            console.error('Lỗi gửi form liên hệ:', error);
            setFormStatus({ submitted: true, success: false, message: 'Đã xảy ra lỗi hệ thống. Vui lòng thử lại sau.' });
        }
    };

    return (
        <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto bg-white shadow-lg rounded-xl overflow-hidden p-8">
                {/* Header Section */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-extrabold text-gray-900 mb-4">Liên Hệ Với Chúng Tôi</h1>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        Chúng tôi luôn sẵn lòng lắng nghe bạn! Nếu bạn có bất kỳ câu hỏi, góp ý hoặc cần hỗ trợ, đừng ngần ngại liên hệ với chúng tôi qua biểu mẫu bên dưới hoặc thông tin liên hệ trực tiếp.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    {/* Contact Form Section */}
                    <div className="lg:pr-8">
                        <h2 className="text-3xl font-bold text-gray-800 mb-6 flex items-center">
                            <FaPaperPlane className="text-blue-600 mr-3" /> Gửi Tin Nhắn Cho Chúng Tôi
                        </h2>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Họ và Tên</label>
                                <input
                                    type="text"
                                    name="name"
                                    id="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                    className="block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-base"
                                />
                            </div>
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Địa chỉ Email</label>
                                <input
                                    type="email"
                                    name="email"
                                    id="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                    className="block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-base"
                                />
                            </div>
                            <div>
                                <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">Chủ đề</label>
                                <input
                                    type="text"
                                    name="subject"
                                    id="subject"
                                    value={formData.subject}
                                    onChange={handleChange}
                                    required
                                    className="block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-base"
                                />
                            </div>
                            <div>
                                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">Nội dung Tin nhắn</label>
                                <textarea
                                    name="message"
                                    id="message"
                                    rows="6"
                                    value={formData.message}
                                    onChange={handleChange}
                                    required
                                    className="block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-base resize-y"
                                    placeholder="Nhập tin nhắn của bạn tại đây..."
                                ></textarea>
                            </div>

                            {formStatus.submitted && (
                                <div className={`p-3 rounded-md text-sm ${formStatus.success ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                    {formStatus.message}
                                </div>
                            )}

                            <div className="flex justify-start">
                                <button
                                    type="submit"
                                    disabled={formStatus.submitted && !formStatus.success}
                                    className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Gửi Tin Nhắn
                                </button>
                            </div>
                        </form>
                    </div>

                    {/* Contact Information Section */}
                    <div className="lg:pl-8 lg:border-l lg:border-gray-200">
                        <h2 className="text-3xl font-bold text-gray-800 mb-6 flex items-center">
                            <FaPhone className="text-blue-600 mr-3" /> Thông Tin Liên Hệ
                        </h2>
                        <div className="space-y-6 text-gray-700 text-lg">
                            <p className="flex items-start">
                                <FaMapMarkerAlt className="flex-shrink-0 text-blue-500 text-xl mt-1 mr-3" />
                                <strong>Địa chỉ:</strong> <br />
                                KTX Khu B, Phường Đông Hòa, <br />
                                Thành phố Dĩ An, Tỉnh Bình Dương, Việt Nam
                            </p>
                            <p className="flex items-center">
                                <FaPhone className="flex-shrink-0 text-blue-500 text-xl mr-3" />
                                <strong>Điện thoại:</strong>&nbsp;(+84) 123 456 789
                            </p>
                            <p className="flex items-center">
                                <FaEnvelope className="flex-shrink-0 text-blue-500 text-xl mr-3" />
                                <strong>Email:</strong>&nbsp;<a href="mailto:support@shoea.com" className="text-blue-600 hover:underline">support@shoea.com</a>
                            </p>
                        </div>

                        {/* Optional: Map Section */}
                        <div className="mt-12">
                            <h2 className="text-3xl font-bold text-gray-800 mb-6 flex items-center">
                                <FaMapMarkerAlt className="text-blue-600 mr-3" /> Vị Trí Của Chúng Tôi
                            </h2>
                            <div className="aspect-w-16 aspect-h-9 rounded-lg overflow-hidden shadow-md">
                                {/* Replace with your actual Google Maps embed code or map component */}
                                <iframe
                                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3918.227448057271!2d106.78672037500366!3d10.868735289303576!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3174d896173cf581%3A0xc31780517595c52c!2zS1RYIEtodSBCIEfhu5NpIE7hu5thIFRULlBDTkhD!5e0!3m2!1svi!2s!4v1700000000000!5m2!1svi!2s"
                                    width="100%"
                                    height="450"
                                    style={{ border: 0 }}
                                    allowFullScreen=""
                                    loading="lazy"
                                    referrerPolicy="no-referrer-when-downgrade"
                                    title="Vị trí của chúng tôi"
                                ></iframe>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Contact;