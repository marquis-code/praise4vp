// Passenger Types
export interface NotificationPreference {
    sms: boolean;
    email: boolean;
    push: boolean;
    SMS: boolean;
    _id: string;
  }
  
  export interface DriverData {
    carBrand: string;
    carModel: string;
    carYear: number;
    carColor: string;
    seats: number;
    rating: number;
    plateNumber: string;
    licenseURL: string;
    licenseIsVerified: boolean;
    walletBalance: number;
    carPhotos: string[] | null;
    carDetailsComplete: boolean;
    proofOfInsuranceVerified: boolean;
    licenseVerificationStatus: string;
    carDescription: string;
    _id: string;
  }
  
  export interface Passenger {
    IDIsVerified: boolean;
    IDVerificationStatus: string;
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    emailIsVerified: boolean;
    hasTransactionPin: boolean;
    phoneIsVerified: boolean;
    dob: string;
    photoURL: string;
    notificationPreference: NotificationPreference;
    hasDriverAccount: boolean;
    driverData: DriverData;
    currentRegistrationStep: number;
    authProvider: string;
    rating: number;
    walletBalance: number;
    createdAt: string;
    updatedAt: string;
  }
  
  // Trip Types
  export interface User {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
  }
  
  export interface GeoPoint {
    type: string;
    geometry: {
      type: string;
      coordinates: number[];
    };
    properties: {
      address: string;
    };
  }
  
  export interface PassengerTrip {
    _id: string;
    passengerId: User;
    origin: GeoPoint;
    destination: GeoPoint;
    fare: number;
    tax: number;
    discount: number;
    totalFare: number;
    passengerStatus: string;
    cancellationReason?: string;
  }
  
  export interface Trip {
    _id: string;
    primaryUserId: User;
    driverId: User;
    type: string;
    isScheduled: boolean;
    scheduledFor: string | null;
    status: string;
    passengers: PassengerTrip[];
    createdAt: string;
    updatedAt: string;
    isPrivate: boolean;
  }