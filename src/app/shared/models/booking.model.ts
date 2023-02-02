export interface BookingCart {
    bookingItems: BookingItem[],
    currIndex?: number,
    loadingPaymentGateway? : boolean
}

export interface BookingItem {
    addons?: Addon[],
    prevUrl?: string,
    searchId: number,
    hotelId: number,
    checkIn: string,
    checkOut: string,
    cityId: number,
    noOfRooms: number,
    totalAmount: number,
    paxInfo: string,
    noOfDays: number,
    noOfAdults: number,
    noOfChildren:number,
    agesOfChildren: number[],
    rooms: Room[],
    renderData?: any
}

export interface Room {
    ratePlanId: number,
    roomId: number,
    price: {
        actual: number,
        discounted: number,
        taxValue: number
    }
}

export interface Addon {
    cost: string,
    currency: string,
    mandatory: boolean,
    policy_description: string,
    policy_id: string,
    policy_image_url: string,
    policy_name: string,
    policy_type_id: string,
    policy_type_name: string,
    qty: number,
}