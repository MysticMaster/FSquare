import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const url = process.env.GHN_URL;
const shop_id = process.env.SHOP_ID;
const token = process.env.TOKEN_API;
const service_type_id = process.env.SERVICE_TYPE_ID;
const required_note = process.env.REQUIRED_NOTE;
const payment_type_id = process.env.PAYMENT_TYPE_ID;

const getProvincesName = async ()=>{
    try{
        const response = await axios.get(`${url}/master-data/province`, {
            headers: {
                'Token': token,
                'Content-Type': 'application/json'
            }
        });
        return response.data.data.map(province => ({
            provinceID: province.ProvinceID,
            provinceName: province.ProvinceName
        }));

    }catch (error) {
        console.error('Error getProvincesName:', error.response ? error.response.data : error.message);
        throw error;
    }
}

const getDistrictsName = async (provinceID) => {
    try {
        const response = await axios.get(`${url}/master-data/district`, {
            headers: {
                'Token': token,
                'Content-Type': 'application/json'
            },
            params: {
                province_id: provinceID
            }
        });
        return response.data.data.map(district => ({
            districtID: district.DistrictID,
            districtName: district.DistrictName
        }));

    } catch (error) {
        console.error('Error getDistrictsName:', error.response ? error.response.data : error.message);
        throw error;
    }
};

const getWardsName = async (districtID) => {
    try {
        const response = await axios.get(`${url}/master-data/ward`, {
            headers: {
                'Token': token,
                'Content-Type': 'application/json'
            },
            params: {
                district_id: districtID
            }
        });
        return response.data.data.map(ward => ({
            wardCode: ward.WardCode,
            wardName: ward.WardName
        }));

    } catch (error) {
        console.error('Error getWardsName:', error.response ? error.response.data : error.message);
        throw error;
    }
}

const orderPreview = async (
    clientOrderCode, toName, toPhone, toAddress, toWardName,
    toDistrictName, toProvinceName, codAmount, weight,content
) => {
    try {
        const response = await axios.post(
            `${url}/v2/shipping-order/preview`,
            {
                service_type_id: parseInt(service_type_id),
                payment_type_id: parseInt(payment_type_id),
                required_note: required_note,
                client_order_code:clientOrderCode,
                to_name: toName,
                to_phone: toPhone,
                to_address: toAddress,
                to_ward_name:toWardName,
                to_district_name:toDistrictName,
                to_province_name: toProvinceName,
                cod_amount: codAmount,
                weight: weight,
                content:content
            },
            {
                headers: {
                    'Token': token,
                    'ShopId': shop_id,
                    'Content-Type': 'application/json'
                }
            }
        );
        return response.data.data.total_fee;
    } catch (error) {
        console.error('Error orderPreview:', error.response ? error.response.data : error.message);
        throw error;
    }
};

const getOrderStatusFromGHN = async (clientOrderCode) => {
    try {
        const response = await axios.get(`${url}/v2/shipping-order/detail-by-client-code`, {
            headers: {
                'Token': token,
                'Content-Type': 'application/json'
            },
            params: {
                client_order_code: clientOrderCode
            }
        });
        return response.data.data.status;
    } catch (error) {
        console.error('Error fetching order status from GHN:', error);
        throw error;
    }
};

const createOrderInGHN = async (order) => {
    try {
        const ghnRequestData = {
            service_type_id: parseInt(service_type_id),
            payment_type_id: parseInt(payment_type_id),
            required_note: required_note,
            client_order_code:order.clientOrderCode,
            to_name:order.shippingAddress.toName,
            to_phone: order.shippingAddress.toPhone,
            to_address: order.shippingAddress.toAddress,
            to_ward_name: order.shippingAddress.toWardName,
            to_district_name:order.shippingAddress.toDistrictName,
            to_province_name: order.shippingAddress.toProvinceName,
            cod_amount: order.isPayment ? 0 : order.codAmount,
            weight: order.weight,
            content: order.content,
            note:order.note
        };

        const response = await axios.post(`${url}/v2/shipping-order/create`, ghnRequestData, {
            headers: {
                'Token': token,
                'ShopId': shop_id,
                'Content-Type': 'application/json'
            }
        });

        return response.data.label;
    } catch (error) {
        console.error('Error in createOrderInGHTK:', error.response ? error.response.data : error.message);
        throw error;
    }
};

export {
    getProvincesName,
    getDistrictsName,
    getWardsName,
    orderPreview,
    getOrderStatusFromGHN,
    createOrderInGHN
}
