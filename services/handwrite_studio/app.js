const $ = id => document.getElementById(id);
let file, result;

function setStatus(value, state="") { 
  const s = $("status"); 
  s.textContent = value; 
  s.className = "status " + state; 
}

function choose(next) { 
  file = next; 
  if(!file) return; 
  $("fileState").textContent = file.name; 
  $("recognize").disabled = false; 
  $("dropZone").hidden = true; 
  $("previewWrap").hidden = false; 
  const isPdf = file.type === "application/pdf"; 
  $("pdfPreview").style.display = isPdf ? "block" : "none"; 
  $("preview").style.display = isPdf ? "none" : "inline"; 
  const url = URL.createObjectURL(file); 
  if(isPdf) $("pdfPreview").src = url; 
  else $("preview").src = url; 
  setStatus("Ready"); 
}

const input = $("fileInput");
const zone = $("dropZone");

input.onchange = () => choose(input.files[0]); 
$("choose").onclick = () => input.click(); 
$("replace").onclick = () => input.click();

["dragenter","dragover"].forEach(e => zone.addEventListener(e, x => { x.preventDefault(); zone.classList.add("drag"); })); 
["dragleave","drop"].forEach(e => zone.addEventListener(e, x => { x.preventDefault(); zone.classList.remove("drag"); })); 
zone.addEventListener("drop", e => choose(e.dataTransfer.files[0]));

$("recognize").onclick = async () => { 
  if(!file) return; 
  const button = $("recognize"); 
  button.disabled = true; 
  button.innerHTML = "Processing Data..."; 
  setStatus("Analyzing"); 
  try { 
    const body = new FormData(); 
    body.append("file", file); 
    const res = await fetch("/api/recognize", { method: "POST", body }); 
    const resJson = await res.json(); 
    if(!res.ok) throw Error(resJson.error); 
    
    const data = resJson.data || resJson;
    result = data; 
    $("empty").hidden = true; 
    $("editor").hidden = false; 
    $("title").value = data.title; 
    $("text").value = data.transcript; 
    $("docType").textContent = data.document_type.toUpperCase(); 
    $("lang").textContent = data.language; 
    
    // Clinical Data UI
    if (data.clinical && data.clinical.medications && data.clinical.medications.length > 0) {
      $("clinicalData").hidden = false;
      $("clinicalList").innerHTML = data.clinical.medications.map(m => `<li>${m}</li>`).join("");
    } else {
      $("clinicalData").hidden = true;
    }
    
    document.querySelectorAll(".exports button").forEach(x => x.disabled = false); 
    setStatus("Converted", "done"); 
  } catch(err) { 
    setStatus("Error"); 
    alert(err.message); 
  } finally { 
    button.disabled = false;
    button.innerHTML = "Extract Clinical Data <span>→</span>"; 
  }
};

document.querySelectorAll("[data-format]").forEach(button => {
  button.onclick = async () => {
    const format = button.dataset.format;
    button.textContent = "...";
    try {
      const payload = { title: $("title").value, text: $("text").value, table: result?.table };
      const res = await fetch(`/api/export/${format}`, {
        method: "POST", 
        headers: { "Content-Type": "application/json" }, 
        body: JSON.stringify(payload)
      });
      if(!res.ok) throw Error("Export failed");
      const blob = await res.blob();
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = "transcription." + format;
      a.click();
      URL.revokeObjectURL(a.href);
    } catch(e) {
      alert(e.message);
    } finally {
      button.textContent = format.toUpperCase();
    }
  }
});