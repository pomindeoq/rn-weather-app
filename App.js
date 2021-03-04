import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
  Animated,
  Image,
  Easing,
} from "react-native";
import Weather from "./components/Weather";
import { API_KEY } from "./utils/WeatherApiKey";
import { weatherConditions } from "./utils/weatherConditions";

export default function App() {
  const [isLoading, setLoading] = useState(true);
  const [temperature, setTemperature] = useState(0);
  const [weatherCondition, setWeatherCondition] = useState("Sunny");
  const [city, setCity] = useState("");
  let spinValue = new Animated.Value(0);

  const spin = () => {
    Animated.timing(spinValue, {
      toValue: 1,
      duration: 4000,
      easing: Easing.linear,
    }).start();
  };

  const spinData = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  useEffect(() => {
    spin();
    navigator.geolocation.getCurrentPosition(
      (position) => {
        fetchWeather(position.coords.latitude, position.coords.longitude);
      },
      (error) => {
        console.log(error);
      }
    );
  }, []);

  const fetchWeather = async (lat, lon) => {
    await fetch(
      `http://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&APPID=${API_KEY}&units=metric`
    )
      .then((res) => res.json())
      .then((json) => {
        console.log(json);
        setTemperature(Math.round(json.main.temp));
        setWeatherCondition(json.weather[0].main);
        setCity(json.name);
        setLoading(false);
      });
  };

  return (
    <View style={styles.container}>
      {isLoading ? (
        <Animated.Image
          style={{
            width: 200,
            height: 200,
            transform: [{ rotate: spinData }],
          }}
          source={{
            uri:
              "https://images.squarespace-cdn.com/content/v1/58d20c79725e25b221549193/1523028284340-2FY0DO8X58JYL5Z2NF2I/ke17ZwdGBToddI8pDm48kJ6OfUsg79IbcV4YOB-L0yJZw-zPPgdn4jUwVcJE1ZvWQUxwkmyExglNqGp0IvTJZUJFbgE-7XRK3dMEBRBhUpyamov21KUb00upTBjz6xK-5957lvgLLFemVzDUABLKbJgjfiUaLHq2TK21hqA4N9s/512px-React-icon.svg.png",
          }}
        />
      ) : (
        <Weather
          weather={weatherCondition}
          cityName={city}
          temperature={temperature}
        />
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
