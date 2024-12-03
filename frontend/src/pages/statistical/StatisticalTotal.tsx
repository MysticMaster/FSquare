import React from "react";

interface Props{
    title:string;
    value:string;
}

const StatisticalTotal:React.FC<Props> = ({title,value})=>{
    return(
        <div className={'w-full h-36 shadow-lg mx-2 border border-gray-300 rounded-lg flex flex-col justify-center items-center'}>
            <h1 className={'text-gray-700 text-xl mb-3'}>{title}</h1>
            <h1 className={'text-black text-2xl font-semibold'}>{value}</h1>
        </div>
    )
}

export default StatisticalTotal;
