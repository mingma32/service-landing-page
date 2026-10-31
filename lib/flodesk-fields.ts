// Field definitions from the owner-supplied Flodesk HTML.
// Public form names are not credentials. Never invent a missing data-field key.
export const SIGNUP_FIELDS = [
  {
    "key": "name",
    "label": "Full Name",
    "required": true,
    "sourceName": "firstName"
  },
  {
    "key": "email",
    "label": "Active Email",
    "required": true,
    "sourceName": "email"
  },
  {
    "key": "phone",
    "label": "WhatsApp Number",
    "required": true,
    "sourceName": "fields.9779800000000"
  },
  {
    "key": "business",
    "label": "Business Name",
    "required": true,
    "sourceName": "fields.nameOfYourBusiness"
  },
  {
    "key": "url",
    "label": "Website or Facebook URL",
    "required": true,
    "sourceName": "fields.httpsYourwebsite"
  },
  {
    "key": "message",
    "label": "Anything You Want to Say",
    "required": false,
    "sourceName": "fields."
  }
] as const;
