import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  TouchableOpacity
} from "react-native";
import { useEffect, useState } from "react";
import { LinearGradient } from "expo-linear-gradient";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useRouter } from "expo-router";
import citiesData from "../data/cities.json";

const Cities = () => {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [filteredCities, setFilteredCities] = useState(citiesData);

  useEffect(() => {
    console.log(search);
    const newFilteredCities = citiesData.filter((city) =>
      city.city.toLocaleLowerCase().includes(search.toLocaleLowerCase()),
    );
    setFilteredCities(newFilteredCities);
  }, [search]);

  return (
    <LinearGradient colors={["#00457D", "#05051F"]} style={style.container}>
      <View style={style.inputContainer}>
        <TextInput
          placeholder="Digite a cidade"
          placeholderTextColor={"#fff"}
          style={style.input}
          value={search}
          onChangeText={(value) => setSearch(value)}
        />
        <MaterialIcons name="search" size={18} color="#fff" />
      </View>
      <ScrollView>
        <View style={style.scrollList}>
          {filteredCities.map((city) => (
          <TouchableOpacity 
          key={city.city}
          onPress= {() => {
          router.push(`/${city.city}`);
        }} style={style.listItem}>
              <Image
                style={style.cityImage}
                source={require("../assets/images/cloud.png")}
              />
              <Text style={style.cityName}>
                {city.city.replace(", ", " - ")}
              </Text>
              <Text style={style.cityTemp}>{city.temp}º </Text>
          </TouchableOpacity>
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
