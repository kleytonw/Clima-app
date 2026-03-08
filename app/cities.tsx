import {
  StyleSheet,
  View,
  Text,
  Image,
  ScrollView,
  TextInput,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useEffect, useState } from "react";
import citiesData from "../data/cities.json";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

const Cities = () => {
  const [search, setSearch] = useState("");
  const [filteredCities, setFilteredCities] = useState(citiesData);

  useEffect(() => {
    console.log(search);
    const newFilteredCities = citiesData.filter((city) =>
      city.city.includes(search)
    );
    setFilteredCities(newFilteredCities);
  }, [search]);

  return (
    <LinearGradient colors={["#00457D", "#05051F"]} style={style.container}>
      <View style={style.inputContainer}>
        <TextInput
          style={style.input}
          placeholder="Digite a cidade"
          placeholderTextColor={"#fff"}
          value={search}
          onChangeText={(value) => setSearch(value)}
        />
        <MaterialIcons name="search" size={18} color="#fff" />
      </View>
      <ScrollView>
        <View style={style.scrollList}>
          {citiesData.map((city) => (
            <View style={style.listItem} key={city.city}>
              <Image
                style={style.cityImage}
                source={require("../assets/images/cloud.png")}
              />
              <Text style={style.cityName}>
                {city.city.replace(", ", " - ")}
              </Text>
              <Text style={style.cityTemp}>{city.temp}º </Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </LinearGradient>
  );
};

const style = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    gap: 16,
    paddingTop: 60,
  },
  scrollList: {
    gap: 16,
  },
  listItem: {
    height: 63,
    width: "100%",
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    alignItems: "center",
    justifyContent: "space-between",
    borderRadius: 16,
    flexDirection: "row",
    paddingHorizontal: 16,
  },
  cityName: {
    color: "#fff",
    fontSize: 16,
    fontFamily: "Montserrat_500Medium",
  },
  cityTemp: {
    color: "#fff",
    fontSize: 25,
    fontFamily: "Montserrat_700Bold",
  },
  cityImage: {
    width: 27,
    height: 24,
  },
  inputContainer: {
    height: 36,
    width: "100%",
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    borderRadius: 24,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
  },
  input: {
    color: "#fff",
    fontSize: 14,
    fontFamily: "Montserrat_500Medium",
  },
});

export default Cities;
