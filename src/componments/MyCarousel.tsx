import React from "react";
import { Carousel } from 'antd';
import './less/MyCarousel.less';
import Logo from '../assets/images/logo.jpg';

interface IStyle {
    height: any,
    color: any,
    lineHeight: any,
    textAlign: any,
    background: any,
}

const contentStyle: IStyle = {
    height: '320px',
    color: '#fff',
    lineHeight: '160px',
    textAlign: 'center',
    background: '#364d79',
};

export default function MyCarousel() {
    return (
        <Carousel autoplay>
            <div>
                <h3 style={contentStyle}>
                    <img src={Logo} alt="#" height={320} width='100%'></img>
                </h3>
            </div>
            <div>
                <h3 style={contentStyle}>2</h3>
            </div>
            <div>
                <h3 style={contentStyle}>3</h3>
            </div>
            <div>
                <h3 style={contentStyle}>4</h3>
            </div>
        </Carousel>
    )
}