import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

function TicketCarouse() {
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

    return (
        <div className="w-full h-full -mt-7 -mb-5 ">
            <Slider {...settings}>
            <div className="">
            <img
                        src="/img/list2.jpg"
                        className="w-full h-full object-cover mr-4"
                        alt="Example image"
                    />
                </div>
                <div className="">
                <img
                        src="/img/list2.jpg"
                        className="w-full h-full object-cover "
                        alt="Example image"
                    />
                </div>
                <div className="">
                <img
                        src="/img/list2.jpg"
                        className="w-full h-full object-cover "
                        alt="Example image"
                    />
                </div>
                <div className="">
                <img
                        src="/img/list2.jpg"
                        className="w-full h-full object-cover "
                        alt="Example image"
                    />
                </div>
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
