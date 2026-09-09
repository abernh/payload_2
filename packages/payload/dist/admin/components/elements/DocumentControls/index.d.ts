import React from 'react';
import type { CollectionPermission, GlobalPermission } from '../../../../auth';
import type { SanitizedCollectionConfig } from '../../../../collections/config/types';
import type { SanitizedGlobalConfig } from '../../../../globals/config/types';
import type { CollectionEditViewProps } from '../../views/types';
import './index.scss';
export declare const DocumentControls: React.FC<{
    apiURL: string;
    collection?: SanitizedCollectionConfig;
    data?: any;
    disableActions?: boolean;
    global?: SanitizedGlobalConfig;
    hasSavePermission?: boolean;
    id?: string;
    isAccountView?: boolean;
    isEditing?: boolean;
    onSave?: CollectionEditViewProps['onSave'];
    permissions?: CollectionPermission | GlobalPermission;
}>;
//# sourceMappingURL=index.d.ts.map