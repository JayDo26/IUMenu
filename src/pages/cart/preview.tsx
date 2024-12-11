import { DisplayPrice } from "components/display/price";
import React, { FC, useState, startTransition } from "react";
import { useRecoilValue } from "recoil";
import {
  selectedDeliveryTimeState,
  orderNoteState,
  phoneState,
  userState,
  cartState,
  totalPriceState,
  totalQuantityState,
} from "state";
import pay from "utils/product";
import { Box, Button, Text } from "zmp-ui";
import { useNavigate } from "react-router-dom";

const formatCartForSheet = (cart) => {
  if (!cart || cart.length === 0) return [];
  return cart.map((item) => {
    const productName = item.product.name;
    const quantity = item.quantity;
    const options =
      typeof item.options === "object" && item.options !== null
        ? item.options
        : {};
    const sizeLabel = options.size || "Không chọn kích cỡ";
    const toppingLabels = Array.isArray(options.topping)
      ? options.topping.join(", ")
      : "Không chọn topping";

    return `${productName} (Kích cỡ: ${sizeLabel}, Topping: ${toppingLabels}): x${quantity}`;
  });
};

export const CartPreview: FC = () => {
  const quantity = useRecoilValue(totalQuantityState);
  const totalPrice = useRecoilValue(totalPriceState);
  const cart = useRecoilValue(cartState);
  const userID = useRecoilValue(userState).id;
  const phone = useRecoilValue(phoneState);
  const takenote = useRecoilValue(orderNoteState);
  const selectedTime = useRecoilValue(selectedDeliveryTimeState); // Thời gian từ state
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const data = {
      userID,
      telephone: phone,
      order: formatCartForSheet(cart).join("\n"),
      total: totalPrice,
      note: takenote,
      date: new Date(selectedTime).toLocaleTimeString("vi-VN"), // Chuyển timestamp thành giờ
    };

    try {
      pay(totalPrice);

      const res = await fetch(
        "https://api.sheetbest.com/sheets/e6f09347-7f14-4cf7-89dc-55b40c88d869",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        }
      );

      if (res.ok) {
        startTransition(() => {
          navigate("/notification");
        });
      } else {
        console.error("Lỗi khi gửi dữ liệu đến API!");
      }
    } catch (error) {
      console.error("Đã xảy ra lỗi:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box flex className="sticky bottom-0 bg-background p-4 space-x-4">
      <Box
        flex
        flexDirection="column"
        justifyContent="space-between"
        className="min-w-[120px] flex-none"
      >
        <Text className="text-gray" size="xSmall">
          {quantity} sản phẩm
        </Text>
        <Text.Title size="large">
          <DisplayPrice>{totalPrice}</DisplayPrice>
        </Text.Title>
      </Box>

      <Box flex flexDirection="column" className="flex-grow">
        <Text className="text-primary font-medium">
          Thời gian nhận hàng:{" "}
          {selectedTime
            ? new Date(selectedTime).toLocaleTimeString("vi-VN")
            : "Chưa chọn"}
        </Text>
        <Button
          type="highlight"
          disabled={!quantity || !selectedTime || loading}
          fullWidth
          onClick={handleSubmit}
        >
          {loading ? "Đang xử lý..." : "Đặt hàng"}
        </Button>
      </Box>
    </Box>
  );
};
