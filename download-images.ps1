# PowerShell script to download specific food images from Unsplash
# URLs are generated dynamically for each menu item

$menuItems = @(
    @{name="Margherita Pizza"; url="https://source.unsplash.com/400x300/?margherita,pizza"},
    @{name="Caesar Salad"; url="https://source.unsplash.com/400x300/?caesar,salad"},
    @{name="Grilled Chicken Burger"; url="https://source.unsplash.com/400x300/?grilled,chicken,burger"},
    @{name="Chocolate Brownie"; url="https://source.unsplash.com/400x300/?chocolate,brownie"},
    @{name="Spaghetti Carbonara"; url="https://source.unsplash.com/400x300/?spaghetti,carbonara"},
    @{name="Chicken Kottu"; url="https://source.unsplash.com/400x300/?chicken,kottu,sri-lankan"},
    @{name="Cheese Chicken Kottu"; url="https://source.unsplash.com/400x300/?cheese,chicken,kottu"},
    @{name="Fish Kottu"; url="https://source.unsplash.com/400x300/?fish,kottu"},
    @{name="Vegetarian Kottu"; url="https://source.unsplash.com/400x300/?vegetarian,kottu"},
    @{name="Rice and Curry"; url="https://source.unsplash.com/400x300/?rice,curry,sri-lankan"},
    @{name="Fried Rice"; url="https://source.unsplash.com/400x300/?fried,rice"},
    @{name="Nasi Goreng"; url="https://source.unsplash.com/400x300/?nasi,goreng"},
    @{name="Biryani"; url="https://source.unsplash.com/400x300/?biryani"},
    @{name="Lamprais"; url="https://source.unsplash.com/400x300/?lamprais,sri-lankan"},
    @{name="Fried Noodles"; url="https://source.unsplash.com/400x300/?fried,noodles"},
    @{name="Cheese Chicken Burger"; url="https://source.unsplash.com/400x300/?cheese,chicken,burger"},
    @{name="Crispy Chicken Burger"; url="https://source.unsplash.com/400x300/?crispy,chicken,burger"},
    @{name="Double Chicken Cheese Burger"; url="https://source.unsplash.com/400x300/?double,chicken,burger"},
    @{name="Crispy Chicken Submarine"; url="https://source.unsplash.com/400x300/?crispy,chicken,sub"},
    @{name="Cheese Chicken Submarine"; url="https://source.unsplash.com/400x300/?cheese,chicken,sub"},
    @{name="Roast Chicken"; url="https://source.unsplash.com/400x300/?roast,chicken"},
    @{name="Chicken Drumsticks"; url="https://source.unsplash.com/400x300/?chicken,drumsticks"},
    @{name="Hot Butter Mushroom"; url="https://source.unsplash.com/400x300/?mushroom,butter"},
    @{name="French Fries"; url="https://source.unsplash.com/400x300/?french,fries"},
    @{name="Egg (Bulls eye)"; url="https://source.unsplash.com/400x300/?fried,egg"},
    @{name="Egg Omelette"; url="https://source.unsplash.com/400x300/?omelette"},
    @{name="Devilled Chicken"; url="https://source.unsplash.com/400x300/?spicy,chicken"},
    @{name="Devilled Fish"; url="https://source.unsplash.com/400x300/?spicy,fish"},
    @{name="Devilled Pork"; url="https://source.unsplash.com/400x300/?spicy,pork"},
    @{name="Devilled Prawns"; url="https://source.unsplash.com/400x300/?spicy,prawns"},
    @{name="Crispy Chicken"; url="https://source.unsplash.com/400x300/?crispy,chicken"},
    @{name="Avocado Juice"; url="https://source.unsplash.com/400x300/?avocado,juice"},
    @{name="Mixed Fruit Juice"; url="https://source.unsplash.com/400x300/?mixed,fruit,juice"},
    @{name="Wood Apple Juice"; url="https://source.unsplash.com/400x300/?wood,apple,juice"},
    @{name="Passion Fruit Juice"; url="https://source.unsplash.com/400x300/?passion,fruit,juice"},
    @{name="Watermelon Juice"; url="https://source.unsplash.com/400x300/?watermelon,juice"},
    @{name="Pineapple Juice"; url="https://source.unsplash.com/400x300/?pineapple,juice"},
    @{name="Papaya Juice"; url="https://source.unsplash.com/400x300/?papaya,juice"},
    @{name="Mango Juice"; url="https://source.unsplash.com/400x300/?mango,juice"},
    @{name="Fruit Salad"; url="https://source.unsplash.com/400x300/?fruit,salad"},
    @{name="Watalappan"; url="https://source.unsplash.com/400x300/?coconut,custard,dessert"}
)

foreach ($item in $menuItems) {
    $filename = $item.name -replace '[^a-zA-Z0-9\s]', '' -replace '\s+', '-' -replace '^\s+|\s+$', '' | ForEach-Object { $_.ToLower() }
    $filename += '.jpg'
    $filepath = Join-Path 'frontend' $filename
    
    try {
        Invoke-WebRequest -Uri $item.url -OutFile $filepath -UseBasicParsing
        Write-Host "Downloaded: $filename"
    } catch {
        Write-Warning "Failed to download for $($item.name): $($_.Exception.Message)"
        # Fallback to a default image if needed
    }
}

Write-Host "Image download complete."
