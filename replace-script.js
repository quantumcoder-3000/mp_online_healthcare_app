const fs = require('fs');
let content = fs.readFileSync('src/components/discovery/DoctorDiscovery.tsx', 'utf8');

const regex = /\{\/\* MP Map & Govt Links Section[\s\S]*?NMC[\s\S]*?<\/div>\s*<\/div>\s*<\/div>/;
const match = content.match(regex);
if (match) {
  const replacement = `
      {/* eSanjeevani Direct Link Section */}
      <div className="mt-16 max-w-2xl mx-auto">
        <a 
          href="https://esanjeevani.mohfw.gov.in" 
          target="_blank" 
          rel="noreferrer"
          className="group block bg-[#11131A] border border-emerald-500/20 p-6 rounded-3xl hover:border-emerald-500/50 transition-all cursor-pointer shadow-lg hover:shadow-emerald-500/10 hover:scale-[1.02]"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-5">
              <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Activity className="w-7 h-7 text-emerald-400" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white mb-1">eSanjeevani Telemedicine</h3>
                <p className="text-sm text-slate-400">Access the National Teleconsultation Service (Reference)</p>
              </div>
            </div>
            <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-emerald-500/20 transition-colors">
              <ArrowRight className="w-5 h-5 text-slate-300 group-hover:text-emerald-400" />
            </div>
          </div>
        </a>
      </div>
`;
  content = content.replace(regex, replacement);
  content = content.replace(
    'import { Search, MapPin, Video, User, Info, AlertTriangle, Calendar, ExternalLink, X, PhoneCall, Check } from "lucide-react";',
    'import { Search, MapPin, Video, User, Info, AlertTriangle, Calendar, ExternalLink, X, PhoneCall, Check, Activity, ArrowRight } from "lucide-react";'
  );
  fs.writeFileSync('src/components/discovery/DoctorDiscovery.tsx', content, 'utf8');
  console.log('Successfully replaced map section.');
} else {
  console.log('Regex did not match.');
}
