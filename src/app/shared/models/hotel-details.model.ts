export interface HotelDetails {
    hotel_id : number,
    hotel_name : string,
    description : string,
    coordinates: {
        latitude: string,
        longitude: string
    },
    address: {
        cityId: number,
        city: string,
        stateId: number,
        state: string,
        countryId: number,
        country: string,
        address_Line: string,
    },
    property_type: string,
    images: string[],
    deal: {
        id: number,
        value: number,
        applicable: boolean
    },
    price: {
        actual: number,
        discounted: number,
        tax: number
    },
    inventory: number,
    goodToKnow: any[],
    commute: any[],
    isWholeSaler: boolean,
    preferedPosition: number,
    check_in: string,
    check_out: string,
    star_rating: number,
    currency: string
}







