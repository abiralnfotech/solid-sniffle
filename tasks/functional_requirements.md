That is an incredibly noble and community-minded idea. Creating a non-profit or community-driven ride-sharing app—often called a "Mutual Aid Ride-Sharing Network" or "Social Carpooling Network"—could completely change how people travel, especially in a country like Nepal where public transport can be overwhelming.

Instead of treating rides as commercial transactions, your platform would treat them as acts of mutual aid.

1. User Authentication & Onboarding
The system ensures every account is verified and permanently linked to a single mobile device and human identity.

Phone-Based Login/Registration: Users register using their Nepali mobile phone number (+977). The app triggers an automatic One-Time Password (OTP) via SMS gateway to verify active ownership of the SIM.
Unique SIM Constraint: The database must prevent a verified phone number from creating more than one account.
Biometric Access: After initial setup, users can log in via face or fingerprint data stored locally on their device for quick access.
2. Identity Verification (KYC) & De-duplication
Because this is a zero-cost charity network, fraud prevention is paramount. The system completely blocks bad actors from creating burner or duplicate profiles using a strict structural check.

Dual-Document Upload: Users must upload high-resolution photos of:
Identity Document: Front and back of their Nepali Citizenship Card (Nagarikta) or National ID (Rashtriya Parichayapatra).
Driver License (Optional): Required only to unlock "Driver Mode."
Strict String Matching Field Validation: The backend checks the manually inputted or OCR-extracted Citizenship/NID Number against the database. If that document string already exists, registration is instantly aborted with a "This identity is already linked to an active account" error.
Manual Admin Approval: Accounts remain in a "Pending Verification" state until an administrator reviews the document uploads via an admin dashboard. Approved users receive a distinct visual badge on their profile.
3. Dual-Mode Core Engine & Live Location Tracking
The app operates on a single dashboard with a primary toggle at the top of the interface: [Passenger Mode] | [Driver Mode].

Active Ride Live Location Tracking
Continuous GPS Streaming: Once a ride shifts to the "Active" state, the app must stream real-time GPS coordinates from the driver's phone to the backend database at regular intervals (e.g., every 3 to 5 seconds).
Passenger Map View: The passenger's app must render a live map interface showing the driver's real-time position moving along the route during pickup and transit.
Background Location Permissions: The app must request and handle "Always Allow" location permissions for drivers to ensure tracking functions continuously even when the driver's phone screen is locked or the app is running in the background.
Passenger Mode Functions
Search and Match: Passengers enter a destination. The app searches active, pre-scheduled driver routes within a specific geographic radius.
Ride Request Queue: Passengers can send a "Seat Request" to a driver, instantly freezing the required credit amount on the passenger's account as "Escrow/Pending".
Driver Mode Functions
Route Publishing: Drivers input a starting location, destination, time of departure, and available seating capacity (e.g., 1 seat for a scooter/bike, up to 4 for a car).
Request Management: Drivers receive push notifications of passenger requests. They can view the passenger's profile and mutual networks before hitting "Accept" or "Decline".
4. Secure Community Credit System
To incentivize drivers without using cash, the app utilizes a closed-loop token system (e.g., "Goodwill Credits"). There is no payment gateway integration (like eSewa or Khalti) for buying credits. Credits are purely earned through community service.

Genesis Credits: Upon passing the strict KYC check, new accounts are granted a baseline pool of startup credits so they can use the app immediately.
The Transaction Engine:
Fares are fixed based strictly on distance matrix calculations (e.g., 1 credit per 3 kilometers). Fares cannot be modified by users to prevent real-world bargaining or exploitation.
The Escrow Mechanism: When a ride is booked, the credits are instantly debited from the passenger and placed into a secure system escrow state.
The Settlement: Upon reaching the destination, the driver clicks "End Ride." The passenger receives a prompt to confirm. Once confirmed, the escrow system releases the credits directly into the driver's wallet profile.
Database Transaction Ledger: Every credit transfer must be treated as an immutable cryptographic double-entry ledger event. A user's total balance must be calculated by summing all historical transactions—never stored as a single editable number block in the database—to prevent database manipulation or hacking.
5. Reporting, Flagging, & Binary Feedback Functions
Accountability is managed via a strict, straightforward review loop enforced immediately upon ride completion.

Mandatory Binary Rating: Upon ride completion (immediately after clicking "End Ride" or confirming destination arrival), both parties must rate the experience. The app blocks access to the main dashboard until this step is completed. The interface presents a simple binary choice:
👍 Good Experience
👎 Bad Experience
Anonymized Safety Tags on Negative Feedback: If a user selects 👎 Bad, the app prompts a mandatory checklist to flag the precise issue (e.g., Reckless Driving, Unpunctual, Inappropriate Behavior, Asked for Cash Money).
Instant SOS Flag: A prominent, accessible button on the active live-tracking screen allows passengers or drivers to trigger an emergency alert. This immediately sends the current live GPS coordinates and user profile details to the platform's emergency admin panel and designated emergency contacts via SMS.
Automated Moderation & Banning Block:
The backend tracks a running percentage of negative ratings (e.g., Total Bad Ratings / Total Rides). If an account accumulates a negative feedback ratio greater than 15% after their first 10 rides, access is automatically suspended pending manual admin review.