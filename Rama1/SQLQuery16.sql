SELECT 
    constraint_name,
    table_name,
    column_name
FROM 
    INFORMATION_SCHEMA.KEY_COLUMN_USAGE
WHERE 
    table_name = 'CartItems';
	ALTER TABLE CartItems
DROP CONSTRAINT FK__CartItems__Produ__6A30C649;
ALTER TABLE CartItems
ADD CONSTRAINT FK_CartItems_Produ
FOREIGN KEY (ProductID) REFERENCES Products(ProductId)
ON DELETE CASCADE;
