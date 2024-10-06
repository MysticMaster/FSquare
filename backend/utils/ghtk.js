import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const url = process.env.GHTK_URL;
const token = process.env.GHTK_TOKEN;
const pickName = process.env.PICK_NAME;
const pickAddress = process.env.PICK_ADDRESS;
const pickProvince = process.env.PICK_PROVINCES;
const pickDistrict = process.env.PICK_DISTRICT;
const pickWard = process.env.PICK_WARD;
const pickTel = process.env.PICK_TEL;
const pickEmail = process.env.PICK_EMAIL;

const calculateShippingFee = async (province, district, totalWeight, transportMethod) => {
    try {
        const response = await axios.get(`${url}/services/shipment/fee`, {
            params: {
                pick_province: pickProvince,
                pick_district: pickDistrict,
                province: province,
                district: district,
                weight: totalWeight,
                transport: transportMethod,
                deliver_option: 'none',
                tags: [13]
            },
            headers: {
                'Token': token
            }
        });

        return response.data.fee;
    } catch (error) {
        console.error('Error calculating shipping fee:', error.response ? error.response.data : error.message);
        throw error;
    }
}

const getOrderStatusFromGHTK = async (orderID) => {
    try {
        const response = await axios.get(`${url}/services/shipment/order`, {
            headers: {
                'Token': token,
                'Content-Type': 'application/json'
            },
            params: {
                order_id: orderID
            }
        });
        return response.data.status; // Hoặc response.data.status tuỳ thuộc vào API
    } catch (error) {
        console.error('Error fetching order status from GHTK:', error);
        throw error;
    }
};

const createOrderInGHTK = async (order) => {
    try {
        const ghtkRequestData = {
            products: order.products.map(product => ({
                name: product.name,
                weight: product.weight,
                quantity: product.quantity,
                product_code: product.size.toString()
            })),
            order: {
                id: order.orderID,
                pick_name: pickName,
                pick_address: pickAddress,
                pick_province: pickProvince,
                pick_district: pickDistrict,
                pick_ward: pickWard,
                pick_tel: pickTel,
                pick_email:pickEmail,
                name: order.shippingAddress.name,
                address: order.shippingAddress.address,
                province: order.shippingAddress.province,
                district: order.shippingAddress.district,
                ward: order.shippingAddress.ward,
                tel: order.shippingAddress.tel,
                pick_money: order.totalPrice,
                is_freeship: 1,
                note: order.notes,
                value: 0,
                tags: [13],
                deliver_option: 'none',
                transport: order.transportMethod,
                return_name: pickName,
                return_address: pickAddress,
                return_province: pickProvince,
                return_district: pickDistrict,
                return_ward: pickWard,
                return_tel: pickTel,
                return_email: pickEmail
            }
        };

        const response = await axios.post(`${url}/services/shipment/order`, ghtkRequestData, {
            headers: {
                'Token': token,
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
    calculateShippingFee,
    getOrderStatusFromGHTK,
    createOrderInGHTK
}
