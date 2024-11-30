import React from 'react';
import {useSelector} from "react-redux";
import {RootState} from "../redux/store.ts";
import HomeContent from "../components/container/HomeContent.tsx";
import ShoesTable from "./shoes/ShoesTable.tsx";
import ClassificationTable from "./classification/ClassificationTable.tsx";
import SizeTable from "./size/SizeTable.tsx";

const ShoesPage: React.FC = () => {
    const shoesOwn = useSelector((state: RootState) => state.classifications.shoesOwn);
    const classificationOwn = useSelector((state: RootState) => state.sizes.classificationOwn);
    return (
        <div className="relative h-screen max-h-[92.5%]">
            <HomeContent>
                <ShoesTable/>
            </HomeContent>
            {
                shoesOwn && <div className="absolute inset-0 z-10">
                    <HomeContent>
                        <ClassificationTable/>
                    </HomeContent>
                </div>
            }
            {
                classificationOwn && <div className="absolute inset-0 z-10">
                    <HomeContent>
                        <SizeTable/>
                    </HomeContent>
                </div>
            }
        </div>
    );
}

export default ShoesPage;
