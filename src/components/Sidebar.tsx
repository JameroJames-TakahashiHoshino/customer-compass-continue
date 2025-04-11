
import { 
  Sidebar as SidebarContainer,
  SidebarContent,
  SidebarFooter
} from "@/components/ui/sidebar";
import { SidebarLinks } from "@/components/SidebarLinks";

export function Sidebar() {
  return (
    <SidebarContainer>
      <SidebarContent>
        <SidebarLinks />
      </SidebarContent>
      <SidebarFooter className="py-2 px-4">
        <div className="text-xs text-muted-foreground">
          <p>ClientChronicle v1.0</p>
        </div>
      </SidebarFooter>
    </SidebarContainer>
  );
}

export default Sidebar;
