import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useNavigate } from "react-router-dom";


function TicketCarouse({allEvent}) {

    const navigate = useNavigate();




    const handleClick = (eventId) => {
        navigate(`/event/show/${eventId}`, { state: { eventId } });

    }

    const settings = {
        dots: true,
        infinite: true,
        slidesToShow: 3,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 2000,
        rtl: false,
        centerMode: true, // 啟用中心模式
        centerPadding: "-50px", // 中心模式的水平間隔
    };



    // console.log("首頁的圖片資料",allEvent);

    return (
        <div className="w-full h-full -mt-7 -mb-5 ">
            <Slider {...settings}>

                {allEvent.map((event) => (
                    <div key={event.eventId} // 每個卡片需要唯一的 key
                    >
                        {/* 圖片和跳轉連結 */}
                        <img
                            src={event.eventTicketPic} // 圖片來自 API 返回的資料
                            alt={event.eventName} // 使用活動名稱作為圖片的替代文字
                            className="w-full h-80 object-cover mr-4 transition-transform rounded-b-sm duration-300 ease-in-out hover:scale-105"
                            onClick={() => handleClick(event.eventId)}

                        />

                    </div>
                ))}



            </Slider>
            <style>
                {`
                .slick-dots {
                    position: absolute;
                    bottom: 10px;
                    text-align: center;
                    width: 100%;
                    z-index: 10;
                }

                .slick-dots li button:before {
                    font-size: 8px;
                    color: gray;
                }

                .slick-dots li.slick-active button:before {
                    color: white;
                }
                `}
            </style>
        </div>
    );
}

export default TicketCarouse;
