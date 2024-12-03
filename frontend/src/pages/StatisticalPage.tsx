import React, {useEffect, useState} from 'react';
import HomeContent from "../components/container/HomeContent.tsx";
import {useDispatch, useSelector} from "react-redux";
import {AppDispatch, RootState} from "../redux/store.ts";
import {fetchStatisticalDay, fetchStatisticalYear, fetchTop5} from "../redux/reducers/statisticalSlice.ts";
import StatisticalTotal from "./statistical/StatisticalTotal.tsx";
import Top5Item from "./statistical/Top5Item.tsx";
import StatisticalChart from "./statistical/StatisticalChart.tsx";
import DateRangePicker from "./statistical/DateRangePicker.tsx";
import stateStatus from "../utils/stateStatus.ts";
import YearPicker from "./statistical/YearPicker.tsx";
import {setShoesIdDetail} from "../redux/reducers/shoesSlice.ts";

const StatisticalPage: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const top5 = useSelector((state: RootState) => state.statistical.top5);
    const statisticalDay = useSelector((state: RootState) => state.statistical.statisticalDay);
    const statisticalYear = useSelector((state: RootState) => state.statistical.statisticalYear);

    const fetchDayStatus = useSelector((state: RootState) => state.statistical.fetchDayStatus);
    const fetchDayError = useSelector((state: RootState) => state.statistical.fetchDayError);

    const fetchYearStatus = useSelector((state: RootState) => state.statistical.fetchYearStatus);
    const fetchYearError = useSelector((state: RootState) => state.statistical.fetchYearError);

    const today = new Date();
    const currentYear = today.getFullYear();
    const currentDate = today.getDate().toString().padStart(2, '0') + '-' + (today.getMonth() + 1).toString().padStart(2, '0') + '-' + currentYear;
    const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const startOfMonth = firstDayOfMonth.getDate().toString().padStart(2, '0') + '-' + (firstDayOfMonth.getMonth() + 1).toString().padStart(2, '0') + '-' + currentYear;

    const [start, setStart] = useState<string | null>(startOfMonth);
    const [end, setEnd] = useState<string | null>(currentDate);
    const [year, setYear] = useState<number | null>(currentYear);

    const isDayLoading = fetchDayStatus === stateStatus.loadingState;

    useEffect(() => {
        dispatch(fetchTop5());
        dispatch(fetchStatisticalDay({start: start, end: end}));
        dispatch(fetchStatisticalYear({year: year}));
    }, []);

    useEffect(() => {
        dispatch(fetchStatisticalYear({year: year}));
    }, [year]);

    const handleTop5Click = (id:string) => {
        dispatch(setShoesIdDetail(id))
    }

    const handleFilterStatisticalDay = () => {
        if (start !== null && end !== null) {
            const [startDay, startMonth, startYear] = start.split('-');
            const [endDay, endMonth, endYear] = end.split('-');

            const startDate = new Date(`${startYear}-${startMonth}-${startDay}`);
            const endDate = new Date(`${endYear}-${endMonth}-${endDay}`);

            if (endDate < startDate) {
                alert("Ngày kết thúc không thể nhỏ hơn ngày bắt đầu.");
            } else {
                dispatch(fetchStatisticalDay({start: start, end: end}));
            }
        }
    }

    return (
        <div className="relative h-screen max-h-[92.5%]">
            <HomeContent>
                <h1 className="text-2xl font-bold mb-4">Thống kê</h1>
                <div className={'w-full flex items-end justify-end'}>
                    <DateRangePicker
                        startDate={start ? start : ''}
                        endDate={end ? end : ''}
                        onStartDateChange={setStart}
                        onEndDateChange={setEnd}
                    />
                    <button onClick={handleFilterStatisticalDay}
                            className={`ms-5 text-white rounded px-5 py-2  ${isDayLoading ? 'bg-gray-400' : 'bg-blue-500'}`}
                            disabled={isDayLoading}>
                        Lọc
                    </button>
                </div>
                {
                    statisticalDay && (
                        <div className={'w-full flex justify-between items-center mt-5 mb-5'}>

                            <StatisticalTotal title={'Tổng doanh số'} value={statisticalDay.totalSales + ' sản phẩm'}/>
                            <StatisticalTotal title={'Tổng doanh thu'} value=
                                {new Intl.NumberFormat('vi-VN', {
                                    style: 'currency',
                                    currency: 'VND'
                                }).format(statisticalDay.totalRevenue)}
                            />
                            <StatisticalTotal title={'Tổng đơn hàng'} value={statisticalDay.totalOrder + ' đơn'}/>
                        </div>
                    )
                }

                <h1 className="text-2xl font-bold mb-4">Top 5 bán chạy</h1>
                <div className={'w-full grid grid-cols-5 gap-2 mb-5'}>
                    {
                        top5 && top5.length > 0 ? (
                            top5.map((item) => (
                                <Top5Item key={item._id} top5Shoes={item} onClick={()=>handleTop5Click(item._id)}/>
                            ))
                        ) : (
                            <div>
                                <h1>khòn có gì</h1>
                            </div>
                        )
                    }
                </div>
                <h1 className="text-2xl font-bold mb-4">Thống kê năm</h1>
               <div className={'mb-2 w-full flex justify-end px-2'}>
                   <YearPicker
                       selectedYear={year}
                       onYearChange={setYear}
                   />
               </div>
                {
                    statisticalYear && statisticalYear.length > 0 &&
                    <div className={'w-full flex justify-center mb-5'}>
                        <StatisticalChart key={JSON.stringify(statisticalYear)} data={statisticalYear}/>
                    </div>
                }
            </HomeContent>
        </div>
    );
};

export default StatisticalPage;
