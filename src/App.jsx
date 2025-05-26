import { useState } from "react"; // Keep useState, remove useEffect as it's not strictly needed for the new features.
import { server } from "./serer";

const App = () => {
  const [language, setLanguage] = useState("en");
  const [showThanks, setShowThanks] = useState(false);
  // New state for loading and errors
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    name: "",
    industry: "",
    painPoint: "",
    website: "",
    phone: "",
  });

  const form = [
    {
      name: "shopify",
      url: "https://drive.google.com/drive/folders/1FKibJTeLnBzap5sFaAEq6byRAmI9Gb_F?usp=drive_link",
    },
  ];

  // Get URL parameters
  const getUrlParam = (param) => {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
  };

  // Find matching form entry
  const getFormUrl = () => {
    const nameParam = getUrlParam("name");
    if (nameParam) {
      const found = form.find(
        (item) => item.name.toLowerCase() === nameParam.toLowerCase()
      );
      return found ? found.url : null;
    }
    return null;
  };

  const translations = {
    en: {
      title: "Youssef - Software Developer", // Original title
      subtitle: "I build custom software and automation solutions that streamline operations and elevate efficiency—designed for businesses that demand precision and performance.", // Original subtitle
      form: {
        name: "Full Name",
        namePlaceholder: "Enter your full name",
        industry: "Your Industry / Company",
        industryPlaceholder: "e.g. E-commerce, Tech, Retail",
        painPoint: "What's your pain point? (Optional)",
        painPointPlaceholder: "Tell us about your challenges",
        website: "Website (Optional)",
        websitePlaceholder: "https://yourwebsite.com",
        phone: "Phone Number (Optional)",
        phonePlaceholder: "+1 (555) 123-4567",
        submit: "Submit Request",
        processing: "Processing...", // New translation for processing
      },
      thanks: {
        title: "Thank You!",
        message:
          "As we promised you... here's your free resource! if you have any questions, feel free to reach out.",
        linkText: "Access Your Resources",
        backText: "← Back to Form",
      },
      required: "This field is required",
    },
    ar: {
      title: "يوسف - مطور برمجيات", // Arabic translation of the original title
      subtitle: "أقوم بإنشاء حلول برمجية مخصصة وأتمتة لتبسيط العمليات ورفع الكفاءة—مصممة للشركات التي تتطلب الدقة والأداء.", // Arabic translation of the original subtitle
      form: {
        name: "الاسم الكامل",
        namePlaceholder: "أدخل اسمك الكامل",
        industry: "مجال عملك / شركتك",
        industryPlaceholder: "مثال: التجارة الإلكترونية، التكنولوجيا، التجارة",
        painPoint: "ما هي نقطة الألم الخاصة بك؟ (اختياري)",
        painPointPlaceholder: "أخبرنا عن التحديات التي تواجهها",
        website: "الموقع الإلكتروني (اختياري)",
        websitePlaceholder: "https://yourwebsite.com",
        phone: "رقم الهاتف (اختياري)",
        phonePlaceholder: "+966 50 123 4567",
        submit: "إرسال الطلب",
        processing: "جارٍ المعالجة...", // New translation for processing
      },
      thanks: {
        title: "شكرًا لك!",
        message: "كما وعدناك... إليك المورد المجاني الخاص بك! إذا كان لديك أي أسئلة، لا تتردد في التواصل.",
        linkText: "الوصول إلى مواردك",
        backText: "← العودة للنموذج",
      },
      required: "هذا الحقل مطلوب",
    },
  };

  const t = translations[language];

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    // Clear error for the specific field when user starts typing
    if (errors[e.target.name]) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        [e.target.name]: null,
      }));
    }
  };


  // create the submession in db handler
  const createSubmission = async (data) => {
    try {
      const response = await fetch(`${server}api/submissions/create/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        console.log("Error creating submission:", response.statusText);
        throw new Error("Failed to create submission");
      }
      const result = await response.json();
      return result;
    }
    catch (error) {
      console.error("Error creating submission:", error);
      throw error; // Re-throw the error to be handled in the calling function
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Reset errors
    setErrors({});

    // Validate required fields
    const newErrors = {};
    if (!formData.name.trim()) {
      newErrors.name = t.required;
    }
    if (!formData.industry.trim()) {
      newErrors.industry = t.required;
    }

    // If there are errors, show them and don't submit
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Show loading
    setIsLoading(true);

    try {
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Send the data to backend to add it in google sheet
      createSubmission({
        name: formData.name,
        industry: formData.industry,
        automation_needed: getUrlParam("name") || "No",

        pain_point: formData.painPoint,
        website: formData.website,
        phone: formData.phone,
      });

      // Show success page
      setShowThanks(true);
    } catch (error) {
      console.error("Form submission error:", error);
      // Handle submission error if needed (e.g., show an error message)
    } finally {
      setIsLoading(false);
    }
  };

  const toggleLanguage = () => {
    setLanguage(language === "en" ? "ar" : "en");
  };

  if (showThanks) {
    const resourceUrl = getFormUrl();

    return (
      <div
        className={`min-h-screen bg-white ${language === "ar" ? "rtl" : "ltr"}`}
      >
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-2xl mx-auto text-center">
            {/* Language Toggle */}
            <div className="mb-8">
              <button
                onClick={toggleLanguage}
                className="px-4 py-2 bg-[#5356a3] text-white rounded-lg hover:bg-[#5356a3] transition-colors"
              >
                {language === "en" ? "العربية" : "English"}
              </button>
            </div>

            {/* Success Message */}
            <div className="bg-white border border-gray-200 rounded-2xl md:p-12 p-5 shadow-lg">
              <div className="w-20 h-20 bg-[#b1b3e3] rounded-full flex items-center justify-center mx-auto mb-8">
                <svg
                  className="w-10 h-10 text-[#5356a3]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>

              <h1 className="text-4xl font-bold text-gray-900 mb-6">
                {t.thanks.title}
              </h1>

              <p className="text-xl text-gray-600 mb-12 leading-relaxed">
                {t.thanks.message}
              </p>

              {resourceUrl && (
                <div className="mb-8">
                  <a
                    href={resourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-8 py-4 bg-[#5356a3] text-white text-lg font-semibold rounded-xl hover:bg-[#5356a3] transition-colors shadow-lg hover:shadow-xl"
                  >
                    {t.thanks.linkText}
                    <svg
                      className={`w-5 h-5 ${
                        language === "ar" ? "mr-2" : "ml-2"
                      }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                      />
                    </svg>
                  </a>
                </div>
              )}

              <button
                onClick={() => setShowThanks(false)}
                className="text-gray-500 hover:text-gray-700 font-medium transition-colors"
              >
                {t.thanks.backText}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen bg-white ${language === "ar" ? "rtl" : "ltr"}`}
    >
      {/* Header */}
      <header className="bg-black text-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            {/* Language Toggle */}
            <div className="mb-8">
              <button
                onClick={toggleLanguage}
                className="px-4 py-2 bg-[#5356a3] text-white rounded-lg hover:bg-[#6d70a8] transition-colors"
              >
                {language === "en" ? "العربية" : "English"}
              </button>
            </div>

            {/* Header Image Placeholder */}
            <div className="w-32 h-32 bg-[#5356a3] rounded-2xl mx-auto mb-8 flex items-center justify-center">
              <img src="/profile pic.png" alt="" className="rounded-2xl" />
            </div>

            <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
              {t.title}
            </h1>
            <p className="text-lg text-gray-300 max-w-2xl mx-auto leading-relaxed">
              {t.subtitle}
            </p>
          </div>
        </div>
      </header>

      {/* Form Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            <div className="bg-white border border-gray-200 rounded-2xl md:p-12 p-5 shadow-lg">
              <div className="space-y-8">
                {/* Name Field */}
                <div>
                  <label className="block text-lg font-semibold text-gray-900 mb-3">
                    {t.form.name} *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder={t.form.namePlaceholder}
                    className={`w-full px-6 py-4 border rounded-xl text-lg focus:ring-2 focus:ring-[#5356a3] focus:border-transparent transition-all ${
                      errors.name ? "border-red-500 bg-red-50" : "border-gray-300"
                    }`}
                    required
                  />
                  {errors.name && (
                    <p className="mt-2 text-red-600 text-sm">{errors.name}</p>
                  )}
                </div>

                {/* Industry Field */}
                <div>
                  <label className="block text-lg font-semibold text-gray-900 mb-3">
                    {t.form.industry} *
                  </label>
                  <input
                    type="text"
                    name="industry"
                    value={formData.industry}
                    onChange={handleInputChange}
                    placeholder={t.form.industryPlaceholder}
                    className={`w-full px-6 py-4 border rounded-xl text-lg focus:ring-2 focus:ring-[#5356a3] focus:border-transparent transition-all ${
                      errors.industry ? "border-red-500 bg-red-50" : "border-gray-300"
                    }`}
                    required
                  />
                  {errors.industry && (
                    <p className="mt-2 text-red-600 text-sm">{errors.industry}</p>
                  )}
                </div>

                {/* Pain Point Field */}
                <div>
                  <label className="block text-lg font-semibold text-gray-900 mb-3">
                    {t.form.painPoint}
                  </label>
                  <textarea
                    name="painPoint"
                    value={formData.painPoint}
                    onChange={handleInputChange}
                    placeholder={t.form.painPointPlaceholder}
                    rows={4}
                    className="w-full px-6 py-4 border border-gray-300 rounded-xl text-lg focus:ring-2 focus:ring-[#5356a3] focus:border-transparent transition-all resize-none"
                  />
                </div>

                {/* Website Field */}
                <div>
                  <label className="block text-lg font-semibold text-gray-900 mb-3">
                    {t.form.website}
                  </label>
                  <input
                    type="url"
                    name="website"
                    value={formData.website}
                    onChange={handleInputChange}
                    placeholder={t.form.websitePlaceholder}
                    className="w-full px-6 py-4 border border-gray-300 rounded-xl text-lg focus:ring-2 focus:ring-[#5356a3] focus:border-transparent transition-all"
                  />
                </div>

                {/* Phone Field */}
                <div>
                  <label className="block text-lg font-semibold text-gray-900 mb-3">
                    {t.form.phone}
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder={t.form.phonePlaceholder}
                    className="w-full px-6 py-4 border border-gray-300 rounded-xl text-lg focus:ring-2 focus:ring-[#5356a3] focus:border-transparent transition-all"
                  />
                </div>

                {/* Submit Button */}
                <div className="pt-4">
                  <button
                    type="submit"
                    onClick={handleSubmit} // Change from type="submit" on form to onClick on button
                    disabled={isLoading} // Disable button when loading
                    className={`w-full text-white text-xl font-semibold py-5 px-8 rounded-xl transition-all shadow-lg hover:shadow-xl flex items-center justify-center ${
                      isLoading
                        ? "bg-[#6d70a8] cursor-not-allowed" // Lighter color and no-drop cursor when loading
                        : "bg-[#5356a3] hover:bg-[#5356a3]"
                    }`}
                  >
                    {isLoading ? (
                      <>
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white mr-3"></div>
                        {t.form.processing}
                      </>
                    ) : (
                      t.form.submit
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default App;