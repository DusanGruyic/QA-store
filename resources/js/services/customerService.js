export const fetchUserShippingInfo = async () => {
    try {
        await axios
            .get(`${USERS_URL}/${localStorage.getItem("userId")}/shipping-info`)
            .then(async (response) => {
                return await response.data.shipping_info;
            });
    } catch (err) {
        console.error(err);
    }
};
