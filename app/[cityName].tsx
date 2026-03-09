import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { LinearGradient } from "expo-linear-gradient";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

type Forecast = {
  date: string;
  weekday: string;
  max: number;
  min: number;
};

type City = {
  city: string;
  date: string;
  temp: number;
  humidity: number;
  description: string;
  forecast: Forecast[];
};

const CityDetails = () => {
  const router = useRouter();
  const searchParams = useLocalSearchParams<{ cityName?: string | string[] }>();
  const [cityDetails, setCityDetails] = useState<City | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const handleData = useCallback(async () => {
    try {
      const rawCityName = Array.isArray(searchParams.cityName)
        ? searchParams.cityName[0]
        : searchParams.cityName;

      const normalizedCityName = decodeURIComponent(rawCityName ?? "")
        .trim()
        .toLocaleLowerCase();

      if (!normalizedCityName) {
        setCityDetails(null);
        return;
      }

      const response = await fetch("https://climapp-api.vercel.app/api");
      const responseJson: City[] = await response.json();

      const city = responseJson.find(
        (cityData) => cityData.city.toLocaleLowerCase() === normalizedCityName,
      );

      setCityDetails(city ?? null);
    } catch (e) {
      console.error("Error fetching city details:", e);
      setCityDetails(null);
    } finally {
      setIsLoading(false);
    }
  }, [searchParams.cityName]);

  useEffect(() => {
    handleData();
  }, [handleData]);

  if (isLoading) {
    return (
      <LinearGradient colors={["#00457D", "#05051F"]} style={styles.container}>
        <Text style={styles.feedbackText}>Carregando cidade...</Text>
      </LinearGradient>
    );
  }

  if (!cityDetails) {
    return (
      <LinearGradient colors={["#00457D", "#05051F"]} style={styles.container}>
        <Text style={styles.feedbackText}>Cidade não encontrada.</Text>
      </LinearGradient>
    );
  }

  const today = cityDetails.forecast?.[0];
  const upcoming = cityDetails.forecast?.slice(1, 4) ?? [];

  return (
    <LinearGradient colors={["#00457D", "#05051F"]} style={styles.container}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.headerContainer}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <MaterialIcons name="chevron-left" size={28} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{cityDetails.city.replace(", ", " - ")}</Text>
        </View>

        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardHeaderTitle}>Hoje</Text>
            <Text style={styles.cardHeaderTitle}>({today?.date ?? cityDetails.date})</Text>
          </View>

          <View style={styles.cardBox}>
            <Image style={styles.cardImage} source={require("../assets/images/cloud.png")} />
            <Text style={styles.cardTemperature}>{cityDetails.temp}º</Text>
            <Text style={styles.cardDescription}>{cityDetails.description}</Text>
          </View>

          <View style={styles.rowBox}>
            <View style={styles.row}>
              <Image source={require("../assets/icons/humidity.png")} style={styles.infoIcon} />
              <Text style={styles.rowTitle}>Humidity:</Text>
              <Text style={styles.rowValue}>{cityDetails.humidity}%</Text>
            </View>

            <View style={styles.row}>
              <Image source={require("../assets/icons/temperature.png")} style={styles.infoIcon} />
              <Text style={styles.rowTitle}>Min/Max:</Text>
              <Text style={styles.rowValue}>
                {today?.min ?? cityDetails.temp}/{today?.max ?? cityDetails.temp}º
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.forecastWrapper}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.forecastList}
          >
            {upcoming.map((day) => (
              <View key={`${day.weekday}-${day.date}`} style={styles.forecastCard}>
                <Text style={styles.forecastDay}>{day.weekday}</Text>
                <Text style={styles.forecastDate}>({day.date})</Text>
                <Image style={styles.forecastIcon} source={require("../assets/images/cloud.png")} />
                <Text style={styles.forecastTemp}>
                  {day.min}/{day.max}º
                </Text>
              </View>
            ))}
          </ScrollView>
        </View>
      </ScrollView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    gap: 40,
    paddingTop: 40,
  },
  content: {
    gap: 24,
    paddingBottom: 24,
  },
  headerContainer: {
    alignItems: "center",
    justifyContent: "center",
    minHeight: 36,
    position: "relative",
  },
  backButton: {
    position: "absolute",
    left: 0,
    padding: 4,
  },
  headerTitle: {
    color: "#fff",
    fontSize: 34,
    fontFamily: "Montserrat_600SemiBold",
    textAlign: "center",
  },
  card: {
    width: "100%",
    borderRadius: 24,
    backgroundColor: "#4463D5",
    padding: 16,
    gap: 20,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  cardHeaderTitle: {
    color: "#fff",
    fontSize: 28,
    fontFamily: "Montserrat_600SemiBold",
  },
  cardBox: {
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
  },
  cardImage: {
    width: 96,
    height: 86,
  },
  cardTemperature: {
    color: "#fff",
    fontSize: 64,
    fontFamily: "Montserrat_700Bold",
    textAlign: "center",
    lineHeight: 68,
  },
  cardDescription: {
    color: "#fff",
    fontSize: 22,
    fontFamily: "Montserrat_400Regular",
    textAlign: "center",
  },
  rowBox: {
    gap: 10,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  infoIcon: {
    width: 28,
    height: 28,
  },
  rowTitle: {
    color: "#fff",
    fontSize: 22,
    fontFamily: "Montserrat_600SemiBold",
  },
  rowValue: {
    color: "#fff",
    fontSize: 22,
    fontFamily: "Montserrat_400Regular",
    marginLeft: "auto",
  },
  forecastWrapper: {
    backgroundColor: "#021955",
    borderRadius: 16,
    paddingVertical: 14,
  },
  forecastList: {
    paddingHorizontal: 10,
    gap: 12,
  },
  forecastCard: {
    width: 130,
    borderRadius: 20,
    backgroundColor: "#283A63",
    paddingVertical: 14,
    paddingHorizontal: 10,
    alignItems: "center",
    justifyContent: "space-between",
    minHeight: 210,
  },
  forecastDay: {
    color: "#fff",
    fontSize: 18,
    fontFamily: "Montserrat_500Medium",
    textAlign: "center",
  },
  forecastDate: {
    color: "#fff",
    fontSize: 14,
    fontFamily: "Montserrat_400Regular",
    textAlign: "center",
  },
  forecastIcon: {
    width: 50,
    height: 44,
  },
  forecastTemp: {
    color: "#fff",
    fontSize: 38,
    fontFamily: "Montserrat_700Bold",
    textAlign: "center",
  },
  feedbackText: {
    color: "#fff",
    fontSize: 18,
    fontFamily: "Montserrat_600SemiBold",
    textAlign: "center",
  },
});

export default CityDetails;
