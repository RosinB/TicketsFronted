import { useState } from "react";
import ApiService from "../../../api/ApiService";
import { PlusCircle, Building, Phone, FileText } from "lucide-react";

function HostAdd() {
   const [hostData, setHostData] = useState({
       hostName: "",
       hostContact: "",
       hostDescription: "",
   });

   const handleChange = (e) => {
       const { name, value } = e.target;
       setHostData({
           ...hostData,
           [name]: value,
       });
   };

   const handleSubmit = async (e) => {
       e.preventDefault();
       try {
           const response = await ApiService.postAdminHost(hostData);
           console.log(response.data.data);
       } catch (error) {
           console.log("新增失敗", error);
       }
   };

   return (
       <div className="bg-gray-800 rounded-xl shadow-xl max-w-2xl mx-auto">
           {/* Header */}
           <div className="bg-gradient-to-r from-teal-600 to-teal-700 rounded-t-xl px-6 py-4">
               <div className="flex items-center gap-3">
                   <PlusCircle className="w-6 h-6 text-white" />
                   <h2 className="text-xl font-semibold text-white">新增主辦單位</h2>
               </div>
           </div>

           {/* Form */}
           <form onSubmit={handleSubmit} className="p-6 space-y-6">
               <div className="space-y-4">
                   <div>
                       <label className="block text-gray-300 text-sm font-medium mb-2 flex items-center gap-2">
                           <Building className="w-4 h-4 text-teal-500" />
                           主辦名稱
                       </label>
                       <input
                           type="text"
                           name="hostName"
                           value={hostData.hostName}
                           onChange={handleChange}
                           placeholder="輸入主辦名稱"
                           className="w-full px-4 py-2.5 bg-gray-700 border border-gray-600 rounded-lg text-white 
                                    placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500 
                                    focus:border-transparent transition-all duration-200"
                           required
                       />
                   </div>

                   <div>
                       <label className="block text-gray-300 text-sm font-medium mb-2 flex items-center gap-2">
                           <Phone className="w-4 h-4 text-teal-500" />
                           主辦聯絡資訊
                       </label>
                       <input
                           type="text"
                           name="hostContact"
                           value={hostData.hostContact}
                           onChange={handleChange}
                           placeholder="輸入聯絡資訊（例如電話或電子郵件）"
                           className="w-full px-4 py-2.5 bg-gray-700 border border-gray-600 rounded-lg text-white 
                                    placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500 
                                    focus:border-transparent transition-all duration-200"
                           required
                       />
                   </div>

                   <div>
                       <label className="block text-gray-300 text-sm font-medium mb-2 flex items-center gap-2">
                           <FileText className="w-4 h-4 text-teal-500" />
                           主辦敘述
                       </label>
                       <textarea
                           name="hostDescription"
                           value={hostData.hostDescription}
                           onChange={handleChange}
                           placeholder="輸入主辦相關敘述或備註"
                           rows={4}
                           className="w-full px-4 py-2.5 bg-gray-700 border border-gray-600 rounded-lg text-white 
                                    placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500 
                                    focus:border-transparent transition-all duration-200 resize-none"
                       />
                   </div>
               </div>

               {/* Submit Button */}
               <div className="pt-4">
                   <button
                       type="submit"
                       className="w-full bg-gradient-to-r from-teal-500 to-teal-600 text-white py-3 px-4 
                                rounded-lg hover:from-teal-600 hover:to-teal-700 transition-all duration-200 
                                flex items-center justify-center gap-2 font-medium shadow-lg 
                                hover:shadow-teal-500/25"
                   >
                       <PlusCircle className="w-5 h-5" />
                       新增主辦單位
                   </button>
               </div>
           </form>
       </div>
   );
}

export default HostAdd;