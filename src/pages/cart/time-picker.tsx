import React, { FC, useState } from "react";
import { useRecoilState } from "recoil";
import { selectedDeliveryTimeState } from "state";
import { Box, Input, Text } from "zmp-ui";

export const TimePicker: FC = () => {
  const [time, setTime] = useRecoilState(selectedDeliveryTimeState);
  const [inputTime, setInputTime] = useState("");
  const [error, setError] = useState("");

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputTime(value);

    const timeRegex = /^([01]?[0-9]|2[0-3]):([0-5][0-9])$/;
    if (!timeRegex.test(value)) {
      setError("Thời gian không hợp lệ. Vui lòng nhập theo định dạng HH:mm.");
      return;
    }

    const [hours, minutes] = value.split(":").map(Number);
    if (hours < 7 || hours > 17 || (hours === 17 && minutes > 0)) {
      setError("Thời gian phải trong khoảng 07:00 đến 17:00.");
      return;
    }

    setError("");
    const newTime = new Date();
    newTime.setHours(hours, minutes, 0, 0);
    setTime(+newTime); // Lưu timestamp
  };

  return (
    <Box>
      <Text className="text-primary font-medium">Nhập thời gian nhận hàng:</Text>
      <Input
        type="text"
        placeholder="HH:mm (ví dụ: 08:30)"
        value={inputTime}
        onChange={handleTimeChange}
        maxLength={5}
        className="mt-2 mb-1"
      />
      {error && <Text className="text-danger text-sm">{error}</Text>}
      {!error && inputTime && (
        <Text className="text-success text-sm">
          Bạn đã chọn thời gian: {inputTime}
        </Text>
      )}
    </Box>
  );
};
