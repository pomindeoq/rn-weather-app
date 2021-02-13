import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";
import Weather from "./components/Weather";
import { API_KEY } from "./utils/WeatherApiKey";
import { weatherConditions } from "./utils/weatherConditions";

export default function App() {
  const [isLoading, setLoading] = useState(true);
  const [temperature, setTemperature] = useState(0);
  const [weatherCondition, setWeatherCondition] = useState("Sunny");

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        fetchWeather(position.coords.latitude, position.coords.longitude);
      },
      (error) => {
        console.log(error);
      }
    );
  }, []);

  fetchWeather = (lat, lon) => {
    fetch(
      `http://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&APPID=${API_KEY}&units=metric`
    )
      .then((res) => res.json())
      .then((json) => {
        setTemperature(Math.round(json.main.temp));
        setWeatherCondition(json.weather[0].main);
        setLoading(false);
      });
  };

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: weatherConditions[weatherCondition].color },
      ]}
    >
      {isLoading ? (
        <Text>Fetching The Weather</Text>
      ) : (
        <Weather weather={weatherCondition} temperature={temperature} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
