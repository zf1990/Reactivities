
export interface ICar {
    "model" : string;
    "color" : string;
    "topSpeed"?: number;
    "transmission"?: string;
}


const car1: ICar = {
    color: "white",
    model: "nissan altima",
    topSpeed: 120,
    transmission: "CVT"
}

const car2: ICar = {
    color: "black",
    model: "Toyota Rav4"
}

export const cars = [car1, car2];