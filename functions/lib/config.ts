// Booking rules. Availability itself lives in Google Calendar (see README, "Booking").
export const booking = {
  durationMin: 30, // length of a call
  stepMin: 30, // slots start on these boundaries (:00 and :30)
  leadHours: 24, // nothing bookable sooner than this
  horizonDays: 21, // nothing bookable later than this
  timeZone: "America/Chicago", // Pierre's zone, shown beside the visitor's local time
  maxSlots: 400,
};
