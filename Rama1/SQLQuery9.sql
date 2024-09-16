
-- جدول المستخدمين
CREATE TABLE Users (
    UserID INT PRIMARY KEY IDENTITY(1,1),
    FullName VARCHAR(255),
    Email VARCHAR(255) UNIQUE,
    PhoneNumber VARCHAR(20),
    PasswordHash VARCHAR(255),
    UserRole VARCHAR(255),
    ProfilePicture VARCHAR(255)
);
-- Step 1: Add a new column with the desired type
ALTER TABLE Users
ADD TempPasswordSalt VARBINARY(MAX);

-- Step 2: Convert data from the old column to the new column
UPDATE Users
SET TempPasswordSalt = CONVERT(VARBINARY(MAX), PasswordSalt);

-- Step 3: Drop the old column
ALTER TABLE Users
DROP COLUMN PasswordSalt;

-- Step 4: Rename the new column to the old column's name
EXEC sp_rename 'Users.TempPasswordSalt', 'PasswordSalt', 'COLUMN';

-- Step 1: Add a new column with the desired type
ALTER TABLE Users
ADD TempPasswordHash VARBINARY(MAX);

-- Step 2: Convert data from the old column to the new column
UPDATE Users
SET TempPasswordHash = CONVERT(VARBINARY(MAX), PasswordHash);

-- Step 3: Drop the old column
ALTER TABLE Users
DROP COLUMN PasswordHash;

-- Step 4: Rename the new column to the old column's name
EXEC sp_rename 'Users.TempPasswordHash', 'PasswordHash', 'COLUMN';
ALTER TABLE Users
ADD ResetToken NVARCHAR(100) NULL,
    TokenExpiration DATETIME NULL;

-- جدول الأطباء
CREATE TABLE Doctors (
    DoctorID INT PRIMARY KEY IDENTITY(1,1),
    UserID INT,
    Specialization VARCHAR(255),
    ExperienceYears INT,
    ClinicAddress VARCHAR(255),
    AvailableForVolunteering BIT ,
    ConsultationFee DECIMAL(10, 2),
    AvailableTimes TEXT,
    FOREIGN KEY (UserID) REFERENCES Users(UserID)
);

-- جدول المتطوعين
CREATE TABLE Volunteers (
    VolunteerID INT PRIMARY KEY IDENTITY(1,1),
    UserID INT,
    VolunteerRole VARCHAR(255),
    Resume VARCHAR(255),
    Certificates VARCHAR(255),
    Availability TEXT,
    WhyVolunteer TEXT,
    FOREIGN KEY (UserID) REFERENCES Users(UserID)
);

-- جدول المدونة
CREATE TABLE BlogPosts (
    PostID INT PRIMARY KEY IDENTITY(1,1),
    Title VARCHAR(255),
    Content TEXT,
    AuthorID INT,
    Image VARCHAR(255),
    CommentsCount INT,
  CreatedAt DATETIME DEFAULT GETDATE(),
    Category VARCHAR(255),
    FOREIGN KEY (AuthorID) REFERENCES Users(UserID)
);

-- جدول التعليقات
CREATE TABLE Comments (
    CommentID INT PRIMARY KEY IDENTITY(1,1),
    PostID INT,
    UserID INT,
    CommentText TEXT,
  CreatedAt DATETIME DEFAULT GETDATE(),
    FOREIGN KEY (PostID) REFERENCES BlogPosts(PostID),
    FOREIGN KEY (UserID) REFERENCES Users(UserID)
);

CREATE TABLE ActivityCategories (
    CategoryID INT PRIMARY KEY IDENTITY(1,1),
    CategoryName VARCHAR(255) NOT NULL
);
CREATE TABLE Activities (
    ActivityID INT PRIMARY KEY IDENTITY(1,1),
    Title VARCHAR(255) NOT NULL,
    Image VARCHAR(255),
    CategoryID INT, -- ربط بفئة النشاط
    AgeGroup VARCHAR(50),
    Duration VARCHAR(50),
    Materials TEXT,
    Instructions TEXT,
    Suggestions TEXT,
    FOREIGN KEY (CategoryID) REFERENCES ActivityCategories(CategoryID) -- الربط بجدول فئات الأنشطة
);


-- جدول حجز المواعيد
CREATE TABLE Appointments (
    AppointmentID INT PRIMARY KEY IDENTITY(1,1),
    UserID INT,
    DoctorID INT,
    AppointmentDate TIMESTAMP,
    SessionType VARCHAR(255),
    Notes TEXT,
    FOREIGN KEY (UserID) REFERENCES Users(UserID),
    FOREIGN KEY (DoctorID) REFERENCES Doctors(DoctorID)
);

-- جدول الجلسات النفسية
CREATE TABLE PsychologicalSessions (
    SessionID INT PRIMARY KEY IDENTITY(1,1),
    SessionType VARCHAR(255),
    Price DECIMAL(10, 2),
    Description TEXT,
    DoctorID INT,
    FOREIGN KEY (DoctorID) REFERENCES Doctors(DoctorID)
);
-- جدول فئات المنتجات
CREATE TABLE ProductCategories (
    CategoryID INT PRIMARY KEY IDENTITY(1,1),
    CategoryName VARCHAR(255),
    Description TEXT
);
-- جدول المنتجات
CREATE TABLE Products (
    ProductID INT PRIMARY KEY IDENTITY(1,1),
    Title VARCHAR(255),
    Description TEXT,
    Price DECIMAL(10, 2),
    Stock INT,
    CategoryID INT,
    Image VARCHAR(255),
    FOREIGN KEY (CategoryID) REFERENCES ProductCategories(CategoryID)
);



-- جدول الطلبات
CREATE TABLE Orders (
    OrderID INT PRIMARY KEY IDENTITY(1,1),
    UserID INT,
    OrderDate  DATETIME DEFAULT GETDATE(),
    TotalAmount DECIMAL(10, 2),
    ShippingAddress VARCHAR(255),
    OrderStatus VARCHAR(255),
    FOREIGN KEY (UserID) REFERENCES Users(UserID)
);

-- جدول السلة
CREATE TABLE Cart (
    CartID INT PRIMARY KEY IDENTITY(1,1),
    UserID INT,
 CreatedAt DATETIME DEFAULT GETDATE(),
    FOREIGN KEY (UserID) REFERENCES Users(UserID)
);

-- جدول عناصر السلة
CREATE TABLE CartItems (
    CartItemID INT PRIMARY KEY IDENTITY(1,1),
    CartID INT,
    ProductID INT,
    Quantity INT,
    FOREIGN KEY (CartID) REFERENCES Cart(CartID),
    FOREIGN KEY (ProductID) REFERENCES Products(ProductID)
);

-- جدول دردشة الأهالي
CREATE TABLE ParentChats (
    ChatID INT PRIMARY KEY IDENTITY(1,1),
    SenderID INT,
    ReceiverID INT,
    Message TEXT,
    SentAt  DATETIME DEFAULT GETDATE(),
    FOREIGN KEY (SenderID) REFERENCES Users(UserID),
    FOREIGN KEY (ReceiverID) REFERENCES Users(UserID)
);

-- جدول النشاطات المحفوظة والمطبوعة
CREATE TABLE SavedPrintedActivities (
    ActionID INT PRIMARY KEY IDENTITY(1,1),
    UserID INT,
    ActivityID INT,
    ActionType VARCHAR(255),
    ActionDate  DATETIME DEFAULT GETDATE(),
    FOREIGN KEY (UserID) REFERENCES Users(UserID),
    FOREIGN KEY (ActivityID) REFERENCES Activities(ActivityID)
);

-- جدول الاقتراحات
CREATE TABLE Suggestions (
    SuggestionID INT PRIMARY KEY IDENTITY(1,1),
    UserID INT,
    ActivityID INT,
    SuggestedAt DATETIME DEFAULT GETDATE(),
    FOREIGN KEY (UserID) REFERENCES Users(UserID),
    FOREIGN KEY (ActivityID) REFERENCES Activities(ActivityID)
);

-- جدول تقييمات المستخدمين
CREATE TABLE UserFeedbacks (
    FeedbackID INT PRIMARY KEY IDENTITY(1,1),
    UserID INT,
    ContentID INT,
    Rating INT,
    Comment TEXT,
    FOREIGN KEY (UserID) REFERENCES Users(UserID)
);
