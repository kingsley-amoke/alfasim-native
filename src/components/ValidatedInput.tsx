import { KeyboardTypeOptions, StyleSheet, View } from "react-native";
import React from "react";
import { Text, TextInput } from "react-native-paper";
import { Control, Controller } from "react-hook-form";
import { Colors } from "../constants/Colors";

interface FieldTypes {
  firstname: string;
  lastname: string;
  email: string;
  phone: string;
  password: string;
  passwordConfirm: string;
}

const ValidatedInput = ({
  control,
  name,
  ...otherProps
}: {
  name: string;
  control: Control<FieldTypes>;
  keyboardType?: KeyboardTypeOptions;
  label: string;
}) => {
  return (
    <Controller
      control={control}
      name={name}
      render={({
        field: { value, onChange, onBlur },
        fieldState: { error },
      }) => (
        <>
          <TextInput
            {...otherProps}
            mode="outlined"
            
            onChangeText={onChange}
            onBlur={onBlur}

          />

          {error && (
            <Text style={{ color: Colors.light.error, marginLeft: 20 }}>
              {error.message}
            </Text>
          )}
        </>
      )}
    />
  );
};

export default ValidatedInput;

const styles = StyleSheet.create({});
