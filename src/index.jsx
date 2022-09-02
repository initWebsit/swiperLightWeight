/**
 * @function 手绘自用swiper组件
 * @params spaceBetween {number} slide块之间的间隔，number类型，不传默认20
 * @params navigation {boolean} 左右翻页器是否显示 boolean, 不传默认false不展示
 * @params pagination {boolean} 底部分页器是否显示 boolean, 不传默认false不展示
 * @params direction {string} 滚动方向, string类型, rows:横向从左至右, columns: 纵向从上至下, 不传默认rows
 * @params loop {boolean} 是否循环自动滚动, boolean类型, 不传默认false不自动滚动
 * @author liuguangyuan
 * @example
 *  <SwiperLight
 *                 navigation={true}
 *                 pagination={true}
 *                 spaceBetween={20}
 *                 loop={true}
 *             >
 *                 {
 *                     imgList.map((imgRes, imgIndex) => (
 *                         <SwiperSlideLight key={imgIndex}>
 *                             <img className="testImg" src={imgRes.img}/>
 *                         </SwiperSlideLight>
 *                     ))
 *                 }
 * </SwiperLight>
 */
import React, {useEffect, useState, useContext} from 'react';
import './index.less';

const SlideContext = React.createContext({spaceBetween: 20, swiperBoxWidth: 0, direction: 'rows', height: 0});

const RightArrow = (props) => {
    return (
        <svg width="40" height="40" viewBox="0 0 40 40" className={props.className} onClick={props.onClick}>
            <path d="M22.4191 25.0858L22.1716 25.3333L22.6666 25.8282L22.9141 25.5807L22.4191 25.0858ZM27.9999 19.9999L28.2474 20.2474L28.4949 19.9999L28.2474 19.7524L27.9999 19.9999ZM22.9141 14.4191L22.6666 14.1716L22.1716 14.6666L22.4191 14.9141L22.9141 14.4191ZM22.9141 25.5807L28.2474 20.2474L27.7524 19.7524L22.4191 25.0858L22.9141 25.5807ZM28.2474 19.7524L22.9141 14.4191L22.4191 14.9141L27.7524 20.2474L28.2474 19.7524ZM27.9999 19.6499H10.6666V20.3499H27.9999V19.6499ZM19.9999 38.3166C9.8839 38.3166 1.68325 30.1159 1.68325 19.9999H0.983252C0.983252 30.5025 9.4973 39.0166 19.9999 39.0166V38.3166ZM38.3166 19.9999C38.3166 30.1159 30.1159 38.3166 19.9999 38.3166V39.0166C30.5025 39.0166 39.0166 30.5025 39.0166 19.9999H38.3166ZM19.9999 1.68325C30.1159 1.68325 38.3166 9.8839 38.3166 19.9999H39.0166C39.0166 9.4973 30.5025 0.983252 19.9999 0.983252V1.68325ZM19.9999 0.983252C9.4973 0.983252 0.983252 9.4973 0.983252 19.9999H1.68325C1.68325 9.8839 9.8839 1.68325 19.9999 1.68325V0.983252Z" fill={props.color}/>
        </svg>
    )
}

export const SwiperLight = (props) => {
    const spaceBetween = props.spaceBetween && typeof props.spaceBetween === 'number' ? props.spaceBetween : 20;
    const navigation = props.navigation && typeof props.navigation === 'boolean' ? props.navigation : false;
    const pagination = props.pagination && typeof props.pagination === 'boolean' ? props.pagination : false;
    const direction = props.direction && props.direction === 'columns' ? 'columns' : 'rows';
    const height = props.height && typeof props.height === 'number' ? props.height : 300;
    const loop = props.loop && typeof props.loop === 'boolean' ? props.loop : false;
    const children = props.children.length ? props.children : [1];
    const [currentIndex, setCurrentIndex] = useState(0);
    const [showArrow, setShowArrow] = useState(false);
    const [swiperBoxWidth, setSwiperBoxWidth] = useState(document.body.offsetWidth);
    const [timeSlide, setTimeSlide] = useState(null);
    let initX = 0, endX = 0, initSwiperListXArr = [0, 0, 0], initTime = 0, endTime = 0;
    useEffect(() => {
        setSwiperBoxWidth(document.getElementsByClassName('swiperBox')[0].offsetWidth);
        // 是否有设置定时loop
        if (loop) {
            setTimeSlide(setInterval(() => {
                slideFunc(2, true);
            }, 2000));
        }

        return () => {
            if (loop) {
                clearInterval(timeSlide);
            }
        }
    }, []);

    const selectSwiperFunc = (index) => {
        if (index === currentIndex) {
            return;
        }
        if (index > currentIndex) {
            for (let i = 0; i < index - currentIndex; i++) {
                slideFunc(2);
            }
        } else {
            for (let i = 0; i < currentIndex - index; i++) {
                slideFunc(1);
            }
        }
        setCurrentIndex(index);
    }

    const slideFunc = (type, autoSlide) => {
        // 这里判断是否是定时器自动滚动, 如果不是则暂时清除定时器
        if (!autoSlide && loop) {
            setTimeSlide((state) => {
                clearInterval(state);
                return setInterval(() => {
                    slideFunc(2, true);
                }, 2000)
            });
        }

        // 1-往右滑/向下滑(整体向右移动)， 2-往左滑/向上滑(整体向左移动)
        if (type === 1) {
            let ele, index;
            for (let i = 0; i < 3; i++) {
                let num = direction === 'rows' ?
                    parseInt(document.getElementsByClassName("swiperList")[i].style.transform.split('translateX(')[1].split('px')[0]) + (swiperBoxWidth + spaceBetween)
                    :
                    parseInt(document.getElementsByClassName("swiperList")[i].style.transform.split('translateY(')[1].split('px')[0]) + (height + spaceBetween);
                document.getElementsByClassName("swiperList")[i].style.transform = direction === 'rows' ? `translateX(${num}px)` : `translateY(${num}px)`;
                document.getElementsByClassName("swiperList")[i].style.opacity = '1';
                if (num >= ((direction === 'rows' ? swiperBoxWidth : height) + spaceBetween) * children.length * (2 - i)) {
                    ele = document.getElementsByClassName("swiperList")[i];
                    index = i;
                }
            }
            // 极值处理
            if (ele) {
                switch (index) {
                    case 0:
                        ele.style.opacity = '0';
                        ele.style.transform = direction === 'rows' ?
                            `translateX(${-(swiperBoxWidth + spaceBetween) * children.length}px)`
                            :
                            `translateY(${-(height + spaceBetween) * children.length}px)`;
                        break;
                    case 1:
                        ele.style.opacity = '0';
                        ele.style.transform = direction === 'rows' ?
                            `translateX(${-(swiperBoxWidth + spaceBetween) * children.length * 2}px)`
                            :
                            `translateY(${-(height + spaceBetween) * children.length * 2}px)`;
                        break;
                    case 2:
                        ele.style.opacity = '0';
                        ele.style.transform = direction === 'rows' ?
                            `translateX(${-(swiperBoxWidth + spaceBetween) * children.length * 3}px)`
                            :
                            `translateY(${-(height + spaceBetween) * children.length * 3}px)`;
                        break;
                }
            }
            setCurrentIndex(state => {
                return state === 0 ? children.length - 1 : state - 1;
            });
        } else {
            let ele, index;
            for (let i = 0; i < 3; i++) {
                let num = direction === 'rows' ?
                    parseInt(document.getElementsByClassName("swiperList")[i].style.transform.split('translateX(')[1].split('px')[0]) - (swiperBoxWidth + spaceBetween)
                    :
                    parseInt(document.getElementsByClassName("swiperList")[i].style.transform.split('translateY(')[1].split('px')[0]) - (height + spaceBetween);
                document.getElementsByClassName("swiperList")[i].style.transform = direction === 'rows' ? `translateX(${num}px)` : `translateY(${num}px)`;
                document.getElementsByClassName("swiperList")[i].style.opacity = '1';
                if (num <= -((direction === 'rows' ? swiperBoxWidth : height) + spaceBetween) * children.length * (2 + i)) {
                    ele = document.getElementsByClassName("swiperList")[i];
                    index = i;
                }
            }
            // 极值处理
            if (ele) {
                switch (index) {
                    case 0:
                        ele.style.opacity = '0';
                        ele.style.transform = direction === 'rows' ?
                            `translateX(${(swiperBoxWidth + spaceBetween) * children.length}px)`
                            :
                            `translateY(${(height + spaceBetween) * children.length}px)`;
                        break;
                    case 1:
                        ele.style.opacity = '0';
                        ele.style.transform = direction === 'rows' ?
                            `translateX(0px)`
                            :
                            `translateY(0px)`;
                        break;
                    case 2:
                        ele.style.opacity = '0';
                        ele.style.transform = direction === 'rows' ?
                            `translateX(-${(swiperBoxWidth + spaceBetween) * children.length}px)`
                            :
                            `translateY(-${(height + spaceBetween) * children.length}px)`;
                        break;
                }
            }
            setCurrentIndex(state => {
                return state === children.length - 1 ? 0 : state + 1;
            });
        }
    }

    const touchStartFunc = (e) => {
        // 这里是否有设置loop
        if (loop) {
            clearInterval(timeSlide);
        }

        initX = endX = direction === 'rows' ? e.touches[0].clientX : e.touches[0].clientY;
        initTime = new Date().getTime();
        for (let i = 0; i < 3; i++) {
            initSwiperListXArr[i] = direction === 'rows' ?
                parseInt(document.getElementsByClassName("swiperList")[i].style.transform.split('translateX(')[1].split('px')[0])
                :
                parseInt(document.getElementsByClassName("swiperList")[i].style.transform.split('translateY(')[1].split('px')[0]);
            document.getElementsByClassName("swiperList")[i].style.opacity = '1';
            document.getElementsByClassName("swiperList")[i].style.transition = 'none';
        }
    }
    const touchMoveFunc = (e) => {
        e.preventDefault(); //阻止滚动
        endX = direction === 'rows' ? e.changedTouches[0].clientX : e.changedTouches[0].clientY;
        for (let i = 0; i < 3; i++) {
            let num = initSwiperListXArr[i] + parseInt(endX - initX);
            document.getElementsByClassName("swiperList")[i].style.transform = direction === 'rows' ? `translateX(${num}px)` : `translateY(${num}px)`;
        }
    }
    const touchEndFunc = (e) => {
        // 这里是否有设置loop
        if (loop) {
            setTimeSlide((state) => {
                clearInterval(state);
                return setInterval(() => {
                    slideFunc(2, true);
                }, 2000)
            });
        }

        endTime = new Date().getTime();
        let canMoveOnePage = false;
        // 短时内快速移动，可以滚动一页
        if (endTime - initTime <= 200 && Math.abs(endX - initX) >= 9) {
            canMoveOnePage = true
        }
        let needMoveX;
        let currentSwiperXRate = direction === 'rows' ?
            Math.abs((parseInt(document.getElementsByClassName("swiperList")[0].style.transform.split('translateX(')[1].split('px')[0]) - initSwiperListXArr[0]) % (swiperBoxWidth + spaceBetween))
            :
            Math.abs((parseInt(document.getElementsByClassName("swiperList")[0].style.transform.split('translateY(')[1].split('px')[0]) - initSwiperListXArr[0]) % (height + spaceBetween));
        if (endX < initX) {
            if (currentSwiperXRate < (direction === 'rows' ? swiperBoxWidth : height) / 2 && !canMoveOnePage) {
                needMoveX = currentSwiperXRate;
            } else {
                needMoveX = -(((direction === 'rows' ? swiperBoxWidth : height) + spaceBetween) - currentSwiperXRate);
            }
        } else {
            if (currentSwiperXRate < (direction === 'rows' ? swiperBoxWidth : height) / 2 && !canMoveOnePage) {
                needMoveX = -currentSwiperXRate;
            } else {
                needMoveX = (((direction === 'rows' ? swiperBoxWidth : height) + spaceBetween) - currentSwiperXRate);
            }
        }
        // 还原位置
        let ele, index, endMoveXNum;
        for (let i = 0; i < 3; i++) {
            document.getElementsByClassName("swiperList")[i].style.transition = 'transform 0.5s';
            let num = direction === 'rows' ?
                parseInt(document.getElementsByClassName("swiperList")[i].style.transform.split('translateX(')[1].split('px')[0]) + needMoveX
                :
                parseInt(document.getElementsByClassName("swiperList")[i].style.transform.split('translateY(')[1].split('px')[0]) + needMoveX;
            document.getElementsByClassName("swiperList")[i].style.transform = direction === 'rows' ? `translateX(${num}px)` : `translateY(${num}px)`;
            // 如果是>0表示向右滑动/向下移动
            endMoveXNum = num - initSwiperListXArr[i];
            if (endMoveXNum > 0) {
                if (num >= ((direction === 'rows' ? swiperBoxWidth : height) + spaceBetween) * children.length * (2 - i)) {
                    ele = document.getElementsByClassName("swiperList")[i];
                    index = i;
                }
            } else {
                if (num <= -((direction === 'rows' ? swiperBoxWidth : height) + spaceBetween) * children.length * (2 + i)) {
                    ele = document.getElementsByClassName("swiperList")[i];
                    index = i;
                }
            }
        }

        // 极值处理
        if (ele) {
            switch (index) {
                case 0:
                    ele.style.opacity = '0';
                    ele.style.transform = direction === 'rows' ?
                        (endMoveXNum > 0 ? `translateX(${-(swiperBoxWidth + spaceBetween) * children.length}px)` : `translateX(${(swiperBoxWidth + spaceBetween) * children.length}px)`)
                        :
                        (endMoveXNum > 0 ? `translateY(${-(height + spaceBetween) * children.length}px)` : `translateY(${(height + spaceBetween) * children.length}px)`);
                    break;
                case 1:
                    ele.style.opacity = '0';
                    ele.style.transform = direction === 'rows' ?
                        (endMoveXNum > 0 ? `translateX(${-(swiperBoxWidth + spaceBetween) * children.length * 2}px)` : `translateX(0px)`)
                        :
                        (endMoveXNum > 0 ? `translateY(${-(height + spaceBetween) * children.length * 2}px)` : `translateY(0px)`);
                    break;
                case 2:
                    ele.style.opacity = '0';
                    ele.style.transform = direction === 'rows' ?
                        (endMoveXNum > 0 ? `translateX(${-(swiperBoxWidth + spaceBetween) * children.length * 3}px)` : `translateX(-${(swiperBoxWidth + spaceBetween) * children.length}px)`)
                        :
                        (endMoveXNum > 0 ? `translateY(${-(height + spaceBetween) * children.length * 3}px)` : `translateY(-${(height + spaceBetween) * children.length}px)`);
                    break;
            }
        }
        setCurrentIndex(state => {
            let movePageNum = Math.abs(endMoveXNum / ((direction === 'rows' ? swiperBoxWidth : height) + spaceBetween)) % children.length;
            if (endMoveXNum > 0) {
                return (state - movePageNum >= 0) ? state - movePageNum : children.length - (movePageNum - state);
            } else {
                return (state + movePageNum < children.length) ? state + movePageNum : state + movePageNum - children.length;
            }
        });

        // 还原状态参数
        initX = endX = initTime = endTime = 0;
    }

    return (
        <div className="swiperBox"
             // onMouseEnter={() => {setShowArrow(true)}}
             // onMouseLeave={() => {setShowArrow(false)}}
             onTouchStart={(e) => touchStartFunc(e)}
             onTouchMove={(e) => touchMoveFunc(e)}
             onTouchEnd={(e) => touchEndFunc(e)}
             onTouchCancel={(e) => touchEndFunc(e)}
             style={{height: direction === 'rows' ? 'auto' : height + 'px'}}>
            <div className={`swiperListBox ${direction === 'rows' ? '' : 'flexColumns'}`}>
                {
                    [1, 2, 3].map((res, index) => (
                        <div key={index} className={`swiperList ${direction === 'rows' ? '' : 'flexColumns'}`} style={{
                            'transform': direction === 'rows' ?
                                `translateX(-${(swiperBoxWidth + spaceBetween)*children.length}px)`
                                :
                                `translateY(-${(height + spaceBetween)*children.length}px)`
                        }}>
                            <SlideContext.Provider
                                value={{
                                    spaceBetween: spaceBetween,
                                    swiperBoxWidth: swiperBoxWidth,
                                    direction: direction,
                                    height: height
                            }}
                            >
                                {
                                    props.children
                                }
                            </SlideContext.Provider>
                        </div>
                    ))
                }
            </div>
            {
                // showArrow && navigation &&
                navigation &&
                <>
                    <RightArrow color="#fff" onClick={() => slideFunc(1)} className="leftArrowSwiper"/>
                    <RightArrow color="#fff" onClick={() => slideFunc(2)} className="rightArrowSwiper"/>
                </>
            }
            {
                pagination &&
                <div className="swiperPage">
                    {
                        children.map((res, index) => (
                            <div
                                key={index}
                                className={`${currentIndex === index ? 'swiperPage-active' : ''}`}
                                onClick={() => selectSwiperFunc(index)}></div>
                        ))
                    }
                </div>
            }
        </div>
    )

}

export const SwiperSlideLight = (props) => {
    const { swiperBoxWidth, spaceBetween, direction, height } = useContext(SlideContext);

    return (
        <div className="SwiperSlideSelf" style={{
            width: swiperBoxWidth + 'px',
            marginRight: direction === 'rows' ? spaceBetween + 'px' : '0',
            height: direction === 'columns' ? height + 'px' : 'auto',
            marginBottom: direction === 'columns' ? spaceBetween + 'px' : '0'
        }}>
            {
                props.children
            }
        </div>
    )
}