export enum UserRole {
    Volunteer = 0,
    Needy = 1,
  }
  
  export enum AssignmentStatus {
    Active=0,     // משימה פעילה
    Finished=1,   // משימה שהושלמה
    Cancelled=2   // משימה בוטלה
  }
  
  export enum HelpRequestStatus {
    Open =0,       // הבקשה פתוחה, מחכה לשיבוץ
    Matched=1,    // הבקשה כבר משובצת למתנדב
    Completed=2,  // הבקשה הושלמה
    Cancelled=3   // הבקשה בוטלה
  }
  
  export enum Day {
    Sunday = 0,
    Monday = 1,
    Tuesday = 2,
    Wednesday = 3,
    Thursday = 4,
    Friday = 5,
    Saturday = 6,
  }