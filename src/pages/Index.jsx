import React, { useState, useEffect } from "react";
import { Box, Heading, Grid, Button, Text, useToast, Tabs, TabList, TabPanels, Tab, TabPanel, Stat, StatLabel, StatNumber } from "@chakra-ui/react";
import { FaChair, FaClock, FaChartBar } from "react-icons/fa";

const SEAT_COUNT = 20;
const MAX_OCCUPANCY_MINUTES = 60;

const Index = () => {
  const [seats, setSeats] = useState(Array(SEAT_COUNT).fill(null));
  const [timer, setTimer] = useState(null);
  const toast = useToast();

  useEffect(() => {
    if (timer) {
      const timerId = setInterval(() => {
        setTimer((prevTimer) => {
          const updatedTimer = { ...prevTimer, remainingTime: prevTimer.remainingTime - 1 };
          if (updatedTimer.remainingTime === 0) {
            handleCheckout(updatedTimer.seatIndex);
            toast({
              title: "Time's up!",
              description: `Seat ${updatedTimer.seatIndex + 1} is now available.`,
              status: "warning",
              duration: 3000,
              isClosable: true,
            });
          }
          return updatedTimer;
        });
      }, 60000);

      return () => {
        clearInterval(timerId);
      };
    }
  }, [timer, toast]);

  const handleCheckin = (seatIndex) => {
    setSeats((prevSeats) => {
      const updatedSeats = [...prevSeats];
      updatedSeats[seatIndex] = { checkedInAt: new Date() };
      return updatedSeats;
    });
    setTimer({ seatIndex, remainingTime: MAX_OCCUPANCY_MINUTES });
  };

  const handleCheckout = (seatIndex) => {
    setSeats((prevSeats) => {
      const updatedSeats = [...prevSeats];
      updatedSeats[seatIndex] = null;
      return updatedSeats;
    });
    if (timer && timer.seatIndex === seatIndex) {
      setTimer(null);
    }
  };

  const getOccupiedSeatsCount = () => {
    return seats.filter((seat) => seat !== null).length;
  };

  return (
    <Box p={8}>
      <Heading as="h1" size="xl" mb={8}>
        Seat Management
      </Heading>
      <Tabs>
        <TabList>
          <Tab>
            <FaChair /> Seats
          </Tab>
          <Tab>
            <FaChartBar /> Usage Stats
          </Tab>
        </TabList>

        <TabPanels>
          <TabPanel>
            <Grid templateColumns="repeat(4, 1fr)" gap={6}>
              {seats.map((seat, index) => (
                <Button key={index} colorScheme={seat ? "red" : "green"} size="lg" height="120px" onClick={() => (seat ? handleCheckout(index) : handleCheckin(index))}>
                  Seat {index + 1}
                  {seat && (
                    <Text fontSize="sm">
                      <FaClock /> {timer && timer.seatIndex === index ? `${timer.remainingTime} min left` : "Occupied"}
                    </Text>
                  )}
                </Button>
              ))}
            </Grid>
          </TabPanel>
          <TabPanel>
            <Stat>
              <StatLabel>Occupied Seats</StatLabel>
              <StatNumber>{getOccupiedSeatsCount()}</StatNumber>
            </Stat>
            <Stat>
              <StatLabel>Available Seats</StatLabel>
              <StatNumber>{SEAT_COUNT - getOccupiedSeatsCount()}</StatNumber>
            </Stat>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Box>
  );
};

export default Index;
