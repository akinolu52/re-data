
export const chatOptions = {
    responsive: true
};

const random = (num) => Math.floor(Math.random() * num);

export const randomColor = () => (
    "rgba(" + random(255) + "," + random(255) + "," + random(255) + ", 0.5)"
);

export const formatDate = (date) => {
    date = new Date(date);
    return (
        date.getFullYear() + "/" + (date.getMonth() + 1) + "/" + date.getDate()
    );
};

export const getValues = (arr, key) => {
    const result = arr.map((item) => item[key]);

    return result;
};

export const getDateValues = (arr, key) => {
    const result = arr.map((item) => formatDate(item[key]));

    return result;
};
