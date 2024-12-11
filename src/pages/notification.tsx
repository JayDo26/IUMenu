import React, { FC, useState } from "react";
import { ListRenderer } from "components/list-renderer";
import { useRecoilValue } from "recoil";
import { notificationsState } from "state";
import { Box, Header, Page, Text, Modal } from "zmp-ui";
import { Divider } from "components/divider";

const NotificationList: FC = () => {
  const notifications = useRecoilValue(notificationsState);
  const [selectedNotification, setSelectedNotification] = useState<any>(null);

  const handleNotificationClick = (item: any) => {
    setSelectedNotification(item);
  };

  const closeNotificationDetails = () => {
    setSelectedNotification(null);
  };

  return (
    <Box className="bg-background">
      <ListRenderer
        noDivider
        items={notifications}
        renderLeft={() => null} 
        renderRight={(item) => (
          <Box
            key={item.id}
            onClick={() => handleNotificationClick(item)}
            className="cursor-pointer"
          >
            <Text.Header>{item.title}</Text.Header>
            <Text
              size="small"
              className="text-gray overflow-hidden whitespace-nowrap text-ellipsis"
            >
              {item.content}
            </Text>
          </Box>
        )}
      />

      {selectedNotification && (
        <Modal
          visible={!!selectedNotification}
          onClose={closeNotificationDetails}
          title={selectedNotification.title}
        >
          <Box>
            <Text>{selectedNotification.content}</Text>
          </Box>
        </Modal>
      )}
    </Box>
  );
};

const NotificationPage: FC = () => {
  return (
    <Page>
      <Header title="Thông báo" showBackIcon={false} />
      <Divider />
      <NotificationList />
    </Page>
  );
};

export default NotificationPage;
