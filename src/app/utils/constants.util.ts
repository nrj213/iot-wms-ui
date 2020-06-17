/**
 * Contains constant values used throughout the application
 */

export class Constants {
  static LOW_THRESHOLD: number = 45;
  static MEDIUM_THRESHOLD: number = 90;

  static IMG_BASE_URL = "/assets/images/";

  static USER_ENDPOINT = "/users";
  static BIN_ENDPOINT = "/bins";
  static MUNICIPALITY_ENDPOINT = "/municipalities";
  static AREA_ENDPOINT = "/areas";
  static COLLECTION_RECORD_ENDPOINT = "/collectionrecords";
  static STAFF_DETAILS_ENDPOINT = "/staff";

  static MUNICIPALITY_ID = "municipalityId";
  static SESSION_STORAGE_NAME = "currentUserInfo";
}
