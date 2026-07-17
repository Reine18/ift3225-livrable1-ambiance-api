import { useState } from "react";
import { useAuth } from "../../context/AuthContext";

export default function ObservationForm() {
  const { token } = useAuth();

  const [location, setLocation] = useState("");
  const [vibe, setVibe] = useState("calm");
  const [sourceProximity, setSourceProximity] = useState("near");
  const [notes, setNotes] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  
  

} 