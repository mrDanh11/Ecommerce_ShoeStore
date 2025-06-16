const vietnamLocations = [
    {
        name: "TP. Hồ Chí Minh",
        value: "Ho Chi Minh",
        districts: [
            {
                name: "Quận 1",
                value: "Quan 1",
                wards: [
                    { name: "Phường Bến Nghé", value: "Phuong Ben Nghe" },
                    { name: "Phường Bến Thành", value: "Phuong Ben Thanh" },
                    // ... Thêm các phường khác của Quận 1
                ]
            },
            {
                name: "Quận Bình Thạnh",
                value: "Quan Binh Thanh",
                wards: [
                    { name: "Phường 1", value: "Phuong 1" },
                    { name: "Phường 2", value: "Phuong 2" },
                    // ... Thêm các phường khác của Bình Thạnh
                ]
            },
            // ... Thêm các quận/huyện khác của TP. Hồ Chí Minh
        ]
    },
    {
        name: "Hà Nội",
        value: "Ha Noi",
        districts: [
            {
                name: "Quận Ba Đình",
                value: "Quan Ba Dinh",
                wards: [
                    { name: "Phường Phúc Xá", value: "Phuong Phuc Xa" },
                    { name: "Phường Trúc Bạch", value: "Phuong Truc Bach" },
                    // ... Thêm các phường khác của Ba Đình
                ]
            },
            {
                name: "Quận Hoàn Kiếm",
                value: "Quan Hoan Kiem",
                wards: [
                    { name: "Phường Chương Dương Độ", value: "Phuong Chuong Duong Do" },
                    { name: "Phường Cửa Đông", value: "Phuong Cua Dong" },
                    // ... Thêm các phường khác của Hoàn Kiếm
                ]
            },
            // ... Thêm các quận/huyện khác của Hà Nội
        ]
    },
    {
        name: "Đà Nẵng",
        value: "Da Nang",
        districts: [
            {
                name: "Quận Hải Châu",
                value: "Quan Hai Chau",
                wards: [
                    { name: "Phường Hải Châu 1", value: "Phuong Hai Chau 1" },
                    { name: "Phường Hải Châu 2", value: "Phuong Hai Chau 2" },
                    // ...
                ]
            },
            {
                name: "Quận Sơn Trà",
                value: "Quan Son Tra",
                wards: [
                    { name: "Phường An Hải Bắc", value: "Phuong An Hai Bac" },
                    // ...
                ]
            },
            // ... Thêm các quận/huyện khác của Đà Nẵng
        ]
    },
    {
        name: "Bình Thuận",
        value: "Binh Thuan",
        districts: [
            {
                name: "Phan Thiết",
                value: "Phan Thiet",
                wards: [
                    { name: "Phú Hài", value: "Phu Hai" },
                    { name: "Hàm Tiến", value: "Ham Tien" },
                    // ...
                ]
            },
            {
                name: "Hàm Thuận Nam",
                value: "Ham Thuan Nam",
                wards: [
                    { name: "Tân Thành", value: "Tan Thanh" },
                    // ...
                ]
            },
        ]
    },
    // ... Thêm các tỉnh/thành khác
];

export default vietnamLocations;